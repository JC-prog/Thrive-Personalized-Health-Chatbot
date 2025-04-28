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
        cholesterol = self.cholesterol_category(clinical.cholesterol_total)
        bp = self.bp_category(clinical.systolic_bp, clinical.diastolic_bp)

        data = {
            "HighBP" : bp,
            "HighChol": cholesterol,
            "CholCheck": cholesterol,
            "BMI": bmi,
            "Smoker": lifestyle.smoking,
            "Stroke": history.stroke,
            "HeartDiseaseorAttack": history.heart_history,
            "PhysActivity": lifestyle.active_lifestyle,
            "Fruits": lifestyle.fruits,
            "Veggies": lifestyle.vegetables,
            "HvyAlcoholConsump": lifestyle.alcohol,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": score.generalHealth,
            "MentHlth": score.mentalHealth,
            "PhysHlth": score.physicalHealth,
            "DiffWalk": history.disability,
            "Sex": general.gender,
            "Age": general.age,
            "Education": general.education,
            "Income": general.income,
        }

        print(data)

        return pd.DataFrame([data])

    def predict(self, user_id: int):
        general, clinical, lifestyle, history, score = self.get_user_data(user_id)
        df = self.preprocess(general, clinical, lifestyle, history, score)

        return self.model.predict_proba(df)[0][1]

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