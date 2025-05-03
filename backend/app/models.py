from sqlalchemy import Column, DateTime, Boolean, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=False, nullable=False)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    assessment_done = Column(Boolean, default=False, nullable=False)
    assessment_done_at = Column(DateTime, nullable=True)

    general_data = relationship("UserGeneralData", back_populates="user", uselist=False)
    clinical_measurement = relationship("UserClinicalMeasurement", back_populates="user", uselist=False)
    lifestyle_information = relationship("UserLifeStyleInformation", back_populates="user", uselist=False)
    medical_history = relationship("UserMedicalHistory", back_populates="user", uselist=False)
    health_score = relationship("UserHealthScore", back_populates="user", uselist=False)

class UserGeneralData(Base):
    __tablename__ = "users_general_data"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    age = Column(Integer, nullable=True)
    phone_number = Column(String(255), unique=False, nullable=True)
    gender = Column(Integer, nullable=True)
    education = Column(String(40), nullable=True)
    healthcare = Column(Integer, nullable=True)
    income = Column(Integer, nullable=True)

    user = relationship("User", back_populates="general_data")

class UserClinicalMeasurement(Base):
    __tablename__ = "users_clinical_measurement"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    glucose_level = Column(Integer, nullable=True)
    cholesterol_total = Column(Integer, nullable=True)

    user = relationship("User", back_populates="clinical_measurement")

class UserLifeStyleInformation(Base):
    __tablename__ = "users_lifestyle_information"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    smoking = Column(Integer, nullable=True)
    alcohol = Column(Integer, nullable=True)
    active_lifestyle = Column(Integer, nullable=True)
    vegetables = Column(Integer, nullable=True)
    fruits = Column(Integer, nullable=True)

    user = relationship("User", back_populates="lifestyle_information")

class UserMedicalHistory(Base):
    __tablename__ = "users_medical_history"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    heart_history = Column(Integer, nullable=True)
    stroke = Column(Integer, nullable=True)
    disability = Column(Integer, nullable=True)

    user = relationship("User", back_populates="medical_history")

class UserHealthScore(Base):
    __tablename__ = "users_health_score"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    generalHealth = Column(Integer, nullable=True)
    mentalHealth = Column(Integer, nullable=True)
    physicalHealth = Column(Integer, nullable=True)

    user = relationship("User", back_populates="health_score")

class UserDiabetesPredictionHistory(Base):
    __tablename__ = "user_diabetes_history"

    id = Column(Integer, primary_key = True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    diabetes_risk = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class UserHeartPredictionHistory(Base):
    __tablename__ = "user_heart_history"

    id = Column(Integer, primary_key = True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    heart_risk = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)