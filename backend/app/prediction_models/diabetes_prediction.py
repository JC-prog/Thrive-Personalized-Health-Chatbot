import pandas as pd

from sqlalchemy.orm import Session
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation, UserMedicalHistory, UserHealthScore

class DiabetesRiskPredictor:
    def __init__(self, db: Session, model):
        self.db = db
        self.model = model

    def get_user_data(self, user_id: int):
        general = self.db.query(UserGeneralData).filter_by(id=user_id).first()
        clinical = self.db.query(UserClinicalMeasurement).filter_by(id=user_id).first()
        lifestyle = self.db.query(UserLifeStyleInformation).filter_by(id=user_id).first()
        history = self.db.query(UserMedicalHistory).filter_by(id=user_id).first()
        score = self.db.query(UserHealthScore).filter_by(id=user_id).first()

        return general, clinical, lifestyle, history, score
    
    def preprocess(self, general, clinical, lifestyle, history, score):
        bmi = clinical.weight / (clinical.height ** 2)
        sex = self.gender_category(general.gender)
        cholesterol = self.cholesterol_category(clinical.cholesterol_total)
        bp = self.bp_category(clinical.systolic_bp, clinical.diastolic_bp)

        data = {
            "Age": general.age,
            "Sex": sex,
            "Education": general.education,
            "AnyHealthcare": general.healtcare,
            "Income": general.income,
            "BMI": bmi,
            "HighBP": bp,
            "HighChol": cholesterol,
            "Smoker": lifestyle.smoking,
            "PhysAcitivity": lifestyle.active_lifestyle,
            "AlcoholConsumption": lifestyle.alcohol,
            "Veggies": lifestyle.vegetables,
            "Fruits": lifestyle.fruits,
            "HeartDiseaseHistory": history.heart_history,
            "Stroke": history.stroke,
            "DiffWalk": history.disability,
            "GenHlth": score.generalHealth,
            "MentHlth": score.mentalHealth,
            "PhysHlth": score.physicalHealth
        }

        return pd.DataFrame([data])

    def predict(self, user_id: int):
        general, clinical, lifestyle = self.get_user_data(user_id)
        df = self.preprocess(general, clinical, lifestyle)

        return self.model.predict_proba(df)[0][1]
    
    @staticmethod
    def gender_category(gender):
        if gender.lower() == "male":
            return 1
        else:
            return 0

    @staticmethod
    def cholesterol_category(cholesterol):
        if cholesterol > 239:
            return 1
        else:
            return 0
        
    @staticmethod
    def bp_category(sys, dia):
        if sys < 120 and dia < 80:
            return 0
        elif 120 <= sys < 130 and dia < 80:
            return 0
        elif (130 <= sys < 140) or (80 <= dia < 90):
            return 1
        return 1