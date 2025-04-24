import pandas as pd

from sqlalchemy.orm import Session
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation

class DiabetesRiskPredictor:
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
        gender = self.gender_category(general.gender)
        cholesterol = self.cholesterol_category(clinical.cholesterol_total)


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
            "BMI": self.bmi_category(bmi),
            "BP": self.bp_category(clinical.systolic_bp, clinical.diastolic_bp)
        }
        return pd.DataFrame([data])

    def predict(self, user_id: int):
        general, clinical, lifestyle = self.get_user_data(user_id)
        df = self.preprocess(general, clinical, lifestyle)

        return self.model.predict_proba(df)[0][1]