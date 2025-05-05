import pandas as pd

from sqlalchemy.orm import Session
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation, UserMedicalHistory, UserHealthScore, UserDiabetesPredictionHistory

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
        try:
            # Fetch user data
            general, clinical, lifestyle, history, score = self.get_user_data(user_id)
            if not all([general, clinical, lifestyle, history, score]):
                raise ValueError("Incomplete user data. Please ensure all required fields are filled.")

            # Preprocess the data
            df = self.preprocess(general, clinical, lifestyle, history, score)

            # Perform the prediction
            predicted_risk = self.model.predict_proba(df)[0][1]

            # Save the prediction to the database
            db_history = UserDiabetesPredictionHistory(
                user_id=user_id,
                diabetes_risk=predicted_risk
            )
            self.db.add(db_history)
            self.db.commit()
            self.db.refresh(db_history)

            return predicted_risk

        except ValueError as ve:
            print(f"ValueError: {ve}")
            return {"error": str(ve)}

        except AttributeError as ae:
            print(f"AttributeError: {ae}")
            return {"error": "Invalid or missing user data attributes. Please check the input data."}

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return {"error": "An unexpected error occurred during prediction. Please try again later."}
    def predict_with_details(self, user_id: int):
        """
        Predict the diabetes risk and return both the predicted risk and the preprocessed dataframe.
        """
        try:
            # Fetch user data
            general, clinical, lifestyle, history, score = self.get_user_data(user_id)
            if not all([general, clinical, lifestyle, history, score]):
                raise ValueError("Incomplete user data. Please ensure all required fields are filled.")

            # Preprocess the data
            df = self.preprocess(general, clinical, lifestyle, history, score)

            # Perform the prediction
            predicted_risk = self.model.predict_proba(df)[0][1]

            # Save the prediction to the database
            db_history = UserDiabetesPredictionHistory(
                user_id=user_id,
                diabetes_risk=predicted_risk
            )
            self.db.add(db_history)
            self.db.commit()
            self.db.refresh(db_history)

            # Return both the predicted risk and the preprocessed dataframe
            return predicted_risk, df

        except ValueError as ve:
            print(f"ValueError: {ve}")
            return {"error": str(ve)}, None

        except AttributeError as ae:
            print(f"AttributeError: {ae}")
            return {"error": "Invalid or missing user data attributes. Please check the input data."}, None

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return {"error": "An unexpected error occurred during prediction. Please try again later."}, None
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