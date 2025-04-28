import pandas as pd

from sqlalchemy.orm import Session
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation

class HeartRiskPredictor:
    def __init__(self, db: Session, model):
        self.db = db
        self.model = model

    def get_user_data(self, user_id: int):
        general = self.db.query(UserGeneralData).filter_by(id=user_id).first()
        clinical = self.db.query(UserClinicalMeasurement).filter_by(id=user_id).first()
        lifestyle = self.db.query(UserLifeStyleInformation).filter_by(id=user_id).first()

        return general, clinical, lifestyle

    def preprocess(self, general, clinical, lifestyle):
        bmi = clinical.weight / (clinical.height ** 2)
        cholesterol = self.cholesterol_category(clinical.cholesterol_total)
        gender = self.gender_category(general.gender)

        data = {
            "age": general.age,
            "height": clinical.height,
            "weight": clinical.weight,
            "gender": gender,
            "ap_hi": clinical.systolic_bp,
            "ap_lo": clinical.diastolic_bp,
            "cholesterol": cholesterol,
            "gluc": self.glucose_category(clinical.glucose_level),
            "smoke": lifestyle.smoking,
            "alco": lifestyle.alcohol,
            "active": lifestyle.active_lifestyle,
            "BMI": self.bmi_category(bmi),
            "BP": self.bp_category(clinical.systolic_bp, clinical.diastolic_bp)
        }

        print(data)

        return pd.DataFrame([data])

    def predict(self, user_id: int):
        general, clinical, lifestyle = self.get_user_data(user_id)
        df = self.preprocess(general, clinical, lifestyle)

        return self.model.predict_proba(df)[0][1]

    @staticmethod
    def bmi_category(bmi):
        if bmi < 18.5:
            return 'Underweight'
        elif bmi < 25:
            return 'Normal'
        elif bmi < 30:
            return 'Overweight'
        return 'Obese'

    @staticmethod
    def bp_category(sys, dia):
        if sys < 120 and dia < 80:
            return 'Normal'
        elif 120 <= sys < 130 and dia < 80:
            return 'Elevated'
        elif (130 <= sys < 140) or (80 <= dia < 90):
            return 'Hypertension Stage 1'
        return 'Hypertension Stage 2'

    @staticmethod
    def cholesterol_category(cholesterol):
        if cholesterol < 200:
            return 1 # Low
        elif cholesterol < 240:
            return 2 # Medium
        else:
            return 3 # High
        
    @staticmethod
    def glucose_category(glucose):
        if glucose < 6.1:
            return 1
        elif glucose < 7:
            return 2 
        else:
            return 3
        
    @staticmethod
    def gender_category(gender):
        if gender == 1:
            return 1 # Male
        else:
            return 2 # Female