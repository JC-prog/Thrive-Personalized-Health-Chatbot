import os
import pickle

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud, database, auth
from app.chatbot.chatbot import generate_response
from app.schemas import ChatRequest, ChatResponse
from app.prediction_models.heart_prediction import HeartRiskPredictor


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
MODEL_PATH = os.path.join(BASE_DIR, "best_random_forest_pipeline.pkl")

# Load the model
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, user_data.username)
    if not user:
        user = crud.get_user_by_username(db, user_data.username_or_email)
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token_data = {"sub": user.username}
    access_token = auth.create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_creation_response = crud.create_user(db, user)

    if "error" in user_creation_response:
        raise HTTPException(status_code=400, detail=user_creation_response["error"])

    return user_creation_response["user"]

@app.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserProfileOut)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    print(payload)
    user = crud.get_user_by_username(db, email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = generate_response(request.message)
    return ChatResponse(response=reply)

@app.get("/predict/{user_id}")
def predict_user_health(user_id: int, db: Session = Depends(get_db)):

    predictor = HeartRiskPredictor(db, model)
    risk_score = predictor.predict(user_id)

    return {"user_id": user_id, "heart_disease_risk_score": risk_score}
