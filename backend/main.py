from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from auth import create_access_token, get_current_user 

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User registration
@app.post("/api/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Validate username existence
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, password=hashed_password, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# User login (Now returns JWT token)
@app.post("/api/login")
async def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# User logout (Not much needed, just remove token on frontend)
@app.post("/api/logout")
async def logout():
    return {"message": "Logged out successfully"}

# Get user details (Protected route)
@app.get("/api/user", response_model=UserResponse)
async def get_user(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == current_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user

# Protect Dashboard with JWT validation (Sample route for protected area)
@app.get("/dashboard")
async def dashboard(current_user: str = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"message": f"Welcome to the dashboard, {current_user}!"}

# Dependency for getting the current user
