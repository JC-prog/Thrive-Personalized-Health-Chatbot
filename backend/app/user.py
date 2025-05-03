from .models import User, UserGeneralData, UserClinicalMeasurement, UserLifeStyleInformation, UserMedicalHistory, UserHealthScore
from sqlalchemy.orm import Session

class UserWrapper:
    def __init__(self, db: Session, username: str):
        self.db = db
        self.username = username

        # Get User object
        self.user = db.query(User).filter_by(username=username).first()
        if not self.user:
            raise ValueError(f"User '{username}' not found.")

        self.id = self.user.id
        self.name = self.user.name
        self.email = self.user.email
        self.assessment_done = self.user.assessment_done
        self.assessment_done_at = self.user.assessment_done_at

        # Related records
        self.general_data = db.query(UserGeneralData).filter_by(id=self.id).first()
        self.clinical = db.query(UserClinicalMeasurement).filter_by(id=self.id).first()
        self.lifestyle = db.query(UserLifeStyleInformation).filter_by(id=self.id).first()
        self.medical = db.query(UserMedicalHistory).filter_by(id=self.id).first()
        self.health_score = db.query(UserHealthScore).filter_by(id=self.id).first()

    # General Data
    @property
    def age(self):
        return self.general_data.age if self.general_data else None

    @property
    def phone_number(self):
        return self.general_data.phone_number if self.general_data else None

    @property
    def gender(self):
        return self.general_data.gender if self.general_data else None

    @property
    def education(self):
        return self.general_data.education if self.general_data else None

    @property
    def healthcare(self):
        return self.general_data.healthcare if self.general_data else None

    @property
    def income(self):
        return self.general_data.income if self.general_data else None

    # Clinical Measurement
    @property
    def height(self):
        return self.clinical.height if self.clinical else None

    @property
    def weight(self):
        return self.clinical.weight if self.clinical else None

    @property
    def bmi(self):
        return self.clinical.bmi if self.clinical else None

    @property
    def systolic_bp(self):
        return self.clinical.systolic_bp if self.clinical else None

    @property
    def diastolic_bp(self):
        return self.clinical.diastolic_bp if self.clinical else None

    @property
    def glucose_level(self):
        return self.clinical.glucose_level if self.clinical else None

    @property
    def cholesterol_total(self):
        return self.clinical.cholesterol_total if self.clinical else None

    # Lifestyle Information
    @property
    def smoking(self):
        return self.lifestyle.smoking if self.lifestyle else None

    @property
    def alcohol(self):
        return self.lifestyle.alcohol if self.lifestyle else None

    @property
    def active_lifestyle(self):
        return self.lifestyle.active_lifestyle if self.lifestyle else None

    @property
    def vegetables(self):
        return self.lifestyle.vegetables if self.lifestyle else None

    @property
    def fruits(self):
        return self.lifestyle.fruits if self.lifestyle else None

    # Medical History
    @property
    def heart_history(self):
        return self.medical.heart_history if self.medical else None

    @property
    def stroke(self):
        return self.medical.stroke if self.medical else None

    @property
    def disability(self):
        return self.medical.disability if self.medical else None

    # Health Score
    @property
    def general_health(self):
        return self.health_score.generalHealth if self.health_score else None

    @property
    def mental_health(self):
        return self.health_score.mentalHealth if self.health_score else None

    @property
    def physical_health(self):
        return self.health_score.physicalHealth if self.health_score else None
