import pickle
import pandas as pd

from sqlalchemy.orm import Session
from app.models import UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation, UserHeartPredictionHistory

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
        # bmi = clinical.weight / (clinical.height ** 2)
        # cholesterol = self.cholesterol_category(clinical.cholesterol_total)
        # gender = self.gender_category(general.gender)
        #
        # data = {
        #     "age": general.age,
        #     "height": clinical.height,
        #     "weight": clinical.weight,
        #     "gender": gender,
        #     "ap_hi": clinical.systolic_bp,
        #     "ap_lo": clinical.diastolic_bp,
        #     "cholesterol": cholesterol,
        #     "gluc": self.glucose_category(clinical.glucose_level),
        #     "smoke": lifestyle.smoking,
        #     "alco": lifestyle.alcohol,
        #     "active": lifestyle.active_lifestyle,
        #     "BMI": self.bmi_category(bmi),
        #     "BP": self.bp_category(clinical.systolic_bp, clinical.diastolic_bp)
        # }

        bmi = clinical.weight / ((clinical.height/100) ** 2)
        if self.bmi_category(bmi) == 'Normal':
            BMI_0 = 1
        else:
            BMI_0 = 0

        if self.bmi_category(bmi) == 'Obese':
            BMI_1 = 1
        else:
            BMI_1 = 0

        if self.cholesterol_category(clinical.cholesterol_total) == 'Normal':
            cholesterol_0 = 1
        else:
            cholesterol_0 = 0

        if self.cholesterol_category(clinical.cholesterol_total) == 'High':
            cholesterol_2 = 1
        else:
            cholesterol_2 = 0

        if self.bp_category(clinical.systolic_bp, clinical.diastolic_bp) == 'Normal':
            BP_3 = 1
        else:
            BP_3 = 0

        if self.bp_category(clinical.systolic_bp, clinical.diastolic_bp) == 'Hypertension Stage 1':
            BP_1 = 1
        else:
            BP_1 = 0

        if self.bp_category(clinical.systolic_bp, clinical.diastolic_bp) == 'Hypertension Stage 2':
            BP_2 = 1
        else:
            BP_2 = 0

        if self.glucose_category(clinical.glucose_level) == 'Normal':
            gluc_0 = 1
        else:
            gluc_0 = 0


        data = {
            "age": general.age,
            "weight": clinical.weight,
            "ap_hi": clinical.systolic_bp,
            "ap_lo": clinical.diastolic_bp,
            "BMI_0": BMI_0,
            'BMI_1': BMI_1,
            "BP_1": BP_1,
            "BP_2": BP_2,
            "BP_3": BP_3,
            'cholesterol_0': cholesterol_0,
            'cholesterol_2': cholesterol_2,
            'gluc_0': gluc_0
        }

        print(data)

        return pd.DataFrame([data])

    def predict(self, user_id: int):
        general, clinical, lifestyle = self.get_user_data(user_id)
        df = self.preprocess(general, clinical, lifestyle)

        # predicted_risk = self.model.predict_proba(df)[0][1]
        # with open("best_decision_tree_model.pkl", "rb") as f:
        #    model = pickle.load(f)

        risk_score = self.model.predict_proba(df)[0][1]
        print(risk_score)

        # Store prediction in database
        db_history = UserHeartPredictionHistory(
            user_id=user_id,
            heart_risk=risk_score
        )
        self.db.add(db_history)
        self.db.commit()
        self.db.refresh(db_history)

        return risk_score

    def predict_with_details(self, user_id: int):
        """
        Predict the heart disease risk and return both the predicted risk and the preprocessed user info dataframe.
        Handles exceptions gracefully.
        """
        try:
            # Fetch user data
            general, clinical, lifestyle = self.get_user_data(user_id)
            if not all([general, clinical, lifestyle]):
                raise ValueError("Incomplete user data. Please ensure all required fields are filled.")

            # Preprocess the data
            df = self.preprocess(general, clinical, lifestyle)

            # Perform the prediction
            predicted_risk = self.model.predict_proba(df)[0][1]

            # Save the prediction to the database
            db_history = UserHeartPredictionHistory(
                user_id=user_id,
                heart_risk=predicted_risk
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

    def predict_with_details(self, user_id: int):
        """
        Predict the heart disease risk and return both the predicted risk and the preprocessed user info dataframe.
        Handles exceptions gracefully.
        """
        try:
            # Fetch user data
            general, clinical, lifestyle = self.get_user_data(user_id)
            if not all([general, clinical, lifestyle]):
                raise ValueError("Incomplete user data. Please ensure all required fields are filled.")

            # Preprocess the data
            df = self.preprocess(general, clinical, lifestyle)

            # Perform the prediction
            predicted_risk = self.model.predict_proba(df)[0][1]

            # Save the prediction to the database
            db_history = UserHeartPredictionHistory(
                user_id=user_id,
                heart_risk=predicted_risk
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
    def bmi_category(bmi):
        if bmi < 18.5:
            return 'Underweight' #'BMI_3'
        elif bmi < 25:
            return 'Normal' #'BMI_0'
        elif bmi < 30:
            return 'Overweight' #'BMI_2'
        return 'Obese'  #'BMI_1'

    @staticmethod
    def bp_category(sys, dia):
        if sys < 120 and dia < 80:
            return 'Normal' #'BP_3'
        elif 120 <= sys < 130 and dia < 80:
            return 'Elevated'   #'BP_0'
        elif (130 <= sys < 140) or (80 <= dia < 90):
            return 'Hypertension Stage 1'   #'BP_1'
        return 'Hypertension Stage 2'   #'BP_2'

    @staticmethod
    def cholesterol_category(cholesterol):
        if cholesterol < 200:
            return 'Normal' #'cholesterol_0'
        elif cholesterol < 240:
            return 'Above Normal'   #'cholesterol_1'
        else:
            return 'High'   #'cholesterol_2'

    @staticmethod
    def glucose_category(glucose):
        if glucose < 6.1:
            return 'Normal' #'gluc_0'
        elif glucose < 7:
            return 'Above Normal' #'gluc_1'
        else:
            return 'High'   #'gluc_2'

    @staticmethod
    def gender_category(gender):
        if gender == 1:
            return 0 # Female
        else:
            return 1 # Male