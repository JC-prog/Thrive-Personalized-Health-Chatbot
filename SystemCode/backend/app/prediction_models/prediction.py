from app import database
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation
from sqlalchemy.orm import Session
import pandas as pd

def predict_heart_risk(db: Session, user_id: int, model):
    
    general = db.query(UserGeneralData).filter_by(id=user_id).first()
    clinical = db.query(UserClinicalMeasurement).filter_by(id=user_id).first()
    lifestyle = db.query(UserLifeStyleInformation).filter_by(id=user_id).first()

    bmi = clinical.weight / (clinical.height ** 2)
    gender = gender_category(general.gender)
    cholesterol = cholesterol_category(clinical.cholesterol_total)
    data = {
        "age": general.age,
        "height": clinical.height,
        "weight": clinical.weight,
        "gender": gender,
        "ap_hi": clinical.systolic_bp,
        "ap_lo": clinical.diastolic_bp,
        "cholesterol": cholesterol,
        "gluc": 1,
        "smoke": lifestyle.smoking,
        "alco": lifestyle.alcohol,
        "active": lifestyle.active_lifestyle,
        "BMI": bmi_category(bmi),
        "BP": bp_category(clinical.systolic_bp, clinical.diastolic_bp)
    }

    df = pd.DataFrame([data])

    print(df.head())

    risk_score = model.predict_proba(df)[0][1]

    return risk_score

def predict_diabetes_risk(db: Session, user_id: int, model):

    

    return risk_score


def bmi_category(bmi):
    if bmi < 18.5:
        return 'Underweight'
    elif bmi < 25:
        return 'Normal'
    elif bmi < 30:
        return 'Overweight'
    return 'Obese'

def bp_category(sys, dia):
    if sys < 120 and dia < 80:
        return 'Normal'
    elif 120 <= sys < 130 and dia < 80:
        return 'Elevated'
    elif (130 <= sys < 140) or (80 <= dia < 90):
        return 'Hypertension Stage 1'
    return 'Hypertension Stage 2'

def gender_category(gender):
    if gender.lower() == "male":
        return 1
    else:
        return 2

def cholesterol_category(cholesterol):
    if cholesterol < 200:
        return 0
    elif cholesterol < 240:
        return 1
    else:
        return 2