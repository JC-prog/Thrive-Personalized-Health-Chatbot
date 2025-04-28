from sqlalchemy.orm import Session
from . import models
from passlib.context import CryptContext
from app.models import *
from app.schemas import *
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create User
# Used by Registration
def create_user(db: Session, user_data):
    existing_user_by_email = db.query(models.User).filter(models.User.email == user_data.email).first()
    existing_user_by_username = db.query(models.User).filter(models.User.username == user_data.username).first()

    if existing_user_by_email:
        return {"error": "Email already registered"}
    if existing_user_by_username:
        return {"error": "Username already taken"}

    hashed_password = pwd_context.hash(user_data.password)

    # User Table
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

# Get User by Username
# Used by Login
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Verify User Password
# Used by Login
def verify_password(plain_password, hashed_password):

    return pwd_context.verify(plain_password, hashed_password)

# Update User 
# Used by update_user
def update_user(db: Session, user: User, user_data):

    user_id = user.id

    user.assessment_done = True
    user.assessment_done_at = datetime.now()

    # General Table
    general = db.query(UserGeneralData).filter_by(id=user_id).first()

    if general:
        # If exists, update fields directly
        general.age = user_data.age
        general.gender = user_data.gender
        general.education = user_data.education
        general.healthcare = user_data.healthcare
        general.income = user_data.income
    else:
        # If not exists, create a new object
        db_general = UserGeneralData(
            id=user_id,
            age=user_data.age,
            gender=user_data.gender,
            education=user_data.education,
            healthcare=user_data.healthcare,
            income=user_data.income
        )
        db.add(db_general)

    # Lifestyle Table
    lifestyle = db.query(UserLifeStyleInformation).filter_by(id=user_id).first()

    if lifestyle:
        # If exists, update fields directly
        lifestyle.smoking = user_data.smoking
        lifestyle.alcohol = user_data.alcohol
        lifestyle.active_lifestyle = user_data.active_lifestyle
        lifestyle.vegetables = user_data.vegetables
        lifestyle.fruits = user_data.fruits
        
    else:
        # If not exists, create a new object
        db_lifestyle = UserLifeStyleInformation(
            id=user_id,
            smoking = user_data.smoking,
            alcohol = user_data.alcohol,
            active_lifestyle = user_data.active_lifestyle,
            vegetables = user_data.vegetables,
            fruits = user_data.fruits
        )
        db.add(db_lifestyle)

    # Clinical Table
    clinical = db.query(UserClinicalMeasurement).filter_by(id=user_id).first()

    if clinical:
        clinical.height = user_data.height
        clinical.weight = user_data.weight
        clinical.bmi = user_data.weight / ((user_data.height / 100) ** 2)
        clinical.systolic_bp = user_data.systolic_bp
        clinical.diastolic_bp = user_data.diastolic_bp
        clinical.glucose_level = user_data.glucose_level
        clinical.cholesterol_total = user_data.cholesterol_total
    else:
        db_clinical = UserClinicalMeasurement(
            id=user_id,
            height=user_data.height,
            weight=user_data.weight,
            bmi = user_data.weight / ((user_data.height / 100) ** 2),
            systolic_bp=user_data.systolic_bp,
            diastolic_bp=user_data.diastolic_bp,
            glucose_level=user_data.glucose_level,
            cholesterol_total=user_data.cholesterol_total
        )
        db.add(db_clinical)

    # Medical History Table
    medical_history = db.query(UserMedicalHistory).filter_by(id=user_id).first()

    if medical_history:
        medical_history.heart_history = user_data.heart_history
        medical_history.stroke = user_data.stroke
        medical_history.disability = user_data.disability
    else:
        db_medical_history = UserMedicalHistory(
            id=user_id,
            heart_history=user_data.heart_history,
            stroke=user_data.stroke,
            disability=user_data.disability
        )
        db.add(db_medical_history)

    # Score Table
    score = db.query(UserHealthScore).filter_by(id=user_id).first()

    if score:
        score.generalHealth = user_data.generalHealth
        score.mentalHealth = user_data.mentalHealth
        score.physicalHealth = user_data.physicalHealth
    else:
        db_score = UserMedicalHistory(
            id=user_id,
            generalHealth=user_data.generalHealth,
            mentalHealth=user_data.mentalHealth,
            physicalHealth=user_data.physicalHealth
        )
        db.add(db_score)

    # Commit and refresh all objects
    db.commit()

    # Optionally return the updated data for confirmation or further use
    db.refresh(user)
    db.refresh(general if general else db_general)
    db.refresh(lifestyle if lifestyle else db_lifestyle)
    db.refresh(clinical if clinical else db_clinical)
    db.refresh(medical_history if medical_history else db_medical_history)
    db.refresh(score if score else db_score)

    return {"status": "success", "message": "User updated successfully"}

# User Profile Retrieval
def get_user_profile_by_username(db: Session, username: str) -> UserProfileOutput:
    
    user = db.query(models.User).filter(models.User.username == username).first()

    if user is None:
        return None 

    user_id = user.id

    general = db.query(UserGeneralData).filter_by(id=user_id).first()
    lifestyle = db.query(UserLifeStyleInformation).filter_by(id=user_id).first()
    clinical = db.query(UserClinicalMeasurement).filter_by(id=user_id).first()
    medical_history = db.query(UserMedicalHistory).filter_by(id=user_id).first()
    score = db.query(UserHealthScore).filter_by(id=user_id).first()

    output = UserProfileOutput(
        id = user.id,
        name = user.name,
        username = user.username,
        age = general.age,
        gender = general.gender,
        education = general.education,
        healthcare = general.healthcare,
        income = general.income,
        smoking = lifestyle.smoking,
        alcohol = lifestyle.alcohol,
        active_lifestyle = lifestyle.active_lifestyle,
        vegetables = lifestyle.vegetables,
        fruits = lifestyle.fruits,
        height = clinical.height,
        weight = clinical.weight,
        bmi = clinical.bmi,
        systolic_bp = clinical.systolic_bp,
        diastolic_bp = clinical.diastolic_bp,
        glucose_level = clinical.glucose_level,
        cholesterol_total = clinical.cholesterol_total,
        heart_history = medical_history.heart_history,
        stroke = medical_history.stroke,
        disability = medical_history.disability,
        generalHealth = score.generalHealth,
        mentalHealth = score.mentalHealth,
        physicalHealth = score.physicalHealth,
        assessment_done = user.assessment_done,
        assessment_done_at = user.assessment_done_at
    )

    return output

# Get Historical Diabetes Risk Score
# Used by get_user_risk_score
def get_user_diabetes_risk(db: Session, user_id: int):

    result = db.query(UserDiabetesPredictionHistory).order_by(UserDiabetesPredictionHistory.id.desc()).first()

    if result:
        return result.diabetes_risk
    return None

# Get Historical heart Risk Score
# Used by get_user_risk_score
def get_user_heart_risk(db: Session, user_id: int):

    result = db.query(UserHeartPredictionHistory).order_by(UserHeartPredictionHistory.id.desc()).first()

    if result:
        return result.heart_risk
    return None