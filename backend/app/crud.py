from sqlalchemy.orm import Session
from . import models
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data):
    existing_user_by_email = db.query(models.User).filter(models.User.email == user_data.email).first()
    existing_user_by_username = db.query(models.User).filter(models.User.username == user_data.username).first()

    if existing_user_by_email:
        return {"error": "Email already registered"}
    if existing_user_by_username:
        return {"error": "Username already taken"}

    hashed_password = pwd_context.hash(user_data.password)
    db_user = models.User(
        username=user_data.username,
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"user": db_user}



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
