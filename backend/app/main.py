import os
import pickle

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud, database, auth
from app.chatbot.chatbot import generate_response_openai_async
from app.schemas import ChatRequest, UserRiskScore, ChatResponseJSON
from app.prediction_models.heart_prediction import HeartRiskPredictor
from app.prediction_models.diabetes_prediction import DiabetesRiskPredictor
from pydantic import BaseModel
from typing import Dict, Any
import joblib
import os

class ChatResponse(BaseModel):
    answer: str  # The main answer from the chatbot
    additional_data: Dict[str, Any] = None  # Optional field for any additional JSON data

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],      
)

models.Base.metadata.create_all(bind=database.engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Build the absolute path to the model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HEART_MODEL_PATH = os.path.join(BASE_DIR, "best_random_forest_pipeline.pkl")
DIABETES_MODEL_PATH = os.path.join(BASE_DIR, "xgboost_diabetes_pipeline.pkl")

# Load the model
with open(HEART_MODEL_PATH, "rb") as f:
    heart_model = pickle.load(f)

with open(DIABETES_MODEL_PATH, "rb") as f:
    diabetes_model = joblib.load(f)

# Register API
@app.post("/register", response_model=schemas.UserRegisterOutput)
def register(user: schemas.UserRegisterInput, db: Session = Depends(get_db)):
    user_creation_response = crud.create_user(db, user)

    if "error" in user_creation_response:
        raise HTTPException(status_code=400, detail=user_creation_response["error"])

    return user_creation_response["user"]

# Login API
@app.post("/login", response_model=schemas.UserLoginOutput)
def login(user_data: schemas.UserLoginInput, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, user_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not registered"
        )
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token_data = {"sub": user.username}
    access_token = auth.create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}

# Update User API
@app.post("/updateUser", response_model=schemas.UserUpdateOutput)
def update_user(
    user_data: schemas.UserUpdateInput,
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db), 
):
    payload = auth.decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Token does not contain a valid username")

    user = crud.get_user_by_username(db, username)
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    crud.update_user(db, user, user_data)

    diabetes_predictor = DiabetesRiskPredictor(db, diabetes_model)
    diabetes_risk_score = diabetes_predictor.predict(user.id)
    
    heart_predictor = HeartRiskPredictor(db, heart_model)
    heart_risk_score = heart_predictor.predict(user.id)

    print("Assessment Complete")
    print("Diabetes Risk: " + str(diabetes_risk_score))
    print("Heart Risk: " + str(heart_risk_score))

    return {
        "status": "success",
        "message": "User updated successfully"
    }

# Get User Profile API
@app.get("/me", response_model=schemas.UserProfileOutput)
def get_user_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    username = payload.get("sub")

    user = crud.get_user_profile_by_username(db, username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Chat API
@app.post("/chat", response_model=schemas.ChatResponseJSON)
async def chat(request: ChatRequest, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Chat API endpoint to handle a JSON reply with a single key 'answer'.
    """
    # Decode the token to get the user payload
    payload = auth.decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Token does not contain a valid username")

    # Retrieve the user from the database
    user = crud.get_user_by_username(db, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate the chatbot response
    try:
        reply = await generate_response_openai_async(user.id, request.message, db, diabetes_model, heart_model)
        if reply is None:
            raise HTTPException(status_code=500, detail="Error generating response")
        
        # Ensure the reply contains the expected 'answer' key
        if isinstance(reply, dict) and "answer" in reply:
            return ChatResponseJSON(answer=reply["answer"], additional_data=reply.get("additional_data"))
        else:
            raise HTTPException(status_code=500, detail="Invalid response format from chatbot")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Get Historical Risk Score
@app.get("/risk-score", response_model=UserRiskScore)
def get_user_risk_score(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    username = payload.get("sub")

    user = crud.get_user_profile_by_username(db, username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    diabetes_score = crud.get_user_diabetes_risk(db, user.id)
    heart_score = crud.get_user_heart_risk(db, user.id)
    
    return UserRiskScore(id=user.id, diabetes_risk=diabetes_score, heart_risk=heart_score)