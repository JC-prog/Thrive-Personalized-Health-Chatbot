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

# User Profile Retrieval
def get_user_profile_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def update_user(db: Session, username: str, user_data: dict):
    user = db.query(models.User).filter(models.User.username == username).first()
    general = db.query(models.UserGeneralData).filter_by(id=user.id).first()

    if not user:
        return {"error": "User not found"}

    # Update General Data
    if general is None:
        # If no general data exists, create a new entry
        general = models.UserGeneralData(id=user.id, age=user_data["age"])

    if "age" in user_data and user_data["age"] is not None:
        general.age = user_data["age"]
    if "phone_number" in user_data and user_data["phone_number"] is not None:
        user.general_data.phone_number = user_data["phone_number"]
    if "gender" in user_data and user_data["gender"] is not None:
        user.general_data.gender = user_data["gender"]
    if "education" in user_data and user_data["education"] is not None:
        user.general_data.education = user_data["education"]
    if "healthcare" in user_data and user_data["healthcare"] is not None:
        user.general_data.healthcare = user_data["healthcare"]
    if "income" in user_data and user_data["income"] is not None:
        user.general_data.income = user_data["income"]

    # Update clinical_measurement
    if "height" in user_data and user_data["height"] is not None:
        user.clinical_measurement.height = user_data["height"]
    if "weight" in user_data and user_data["weight"] is not None:
        user.clinical_measurement.weight = user_data["weight"]
    if "bmi" in user_data and user_data["bmi"] is not None:
        user.clinical_measurement.bmi = user_data["bmi"]
    if "systolic_bp" in user_data and user_data["systolic_bp"] is not None:
        user.clinical_measurement.systolic_bp = user_data["systolic_bp"]
    if "diastolic_bp" in user_data and user_data["diastolic_bp"] is not None:
        user.clinical_measurement.diastolic_bp = user_data["diastolic_bp"]
    if "glucose_level" in user_data and user_data["glucose_level"] is not None:
        user.clinical_measurement.glucose_level = user_data["glucose_level"]
    if "cholesterol_total" in user_data and user_data["cholesterol_total"] is not None:
        user.clinical_measurement.cholesterol_total = user_data["cholesterol_total"]

    # Update lifestyle information
    if "smoking" in user_data and user_data["smoking"] is not None:
        user.lifestyle_information.smoking = user_data["smoking"]
    if "alcohol" in user_data and user_data["alcohol"] is not None:
        user.lifestyle_information.alcohol = user_data["alcohol"]
    if "exercise" in user_data and user_data["exercise"] is not None:
        user.lifestyle_information.active_lifestyle = user_data["exercise"]
    if "vegetable" in user_data and user_data["vegetable"] is not None:
        user.lifestyle_information.vegetables = user_data["vegetable"]
    if "fruits" in user_data and user_data["fruits"] is not None:
        user.lifestyle_information.fruits = user_data["fruits"]

    # Update medical history
    if "heart_history" in user_data and user_data["heart_history"] is not None:
        user.medical_history.heart_history = user_data["heart_history"]
    if "stroke" in user_data and user_data["stroke"] is not None:
        user.medical_history.stroke = user_data["stroke"]
    if "disability" in user_data and user_data["disability"] is not None:
        user.medical_history.disability = user_data["disability"]
    
    db.commit()
    db.refresh(user)
    
    return user
