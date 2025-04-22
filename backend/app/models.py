from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=False, nullable=False)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)

    general_data = relationship("UserGeneralData", back_populates="user", uselist=False)
    clinical_measurement = relationship("UserClinicalMeasurement", back_populates="user", uselist=False)
    lifestyle_information = relationship("UserLifeStyleInformation", back_populates="user", uselist=False)

class UserGeneralData(Base):
    __tablename__ = "users_general_data"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    age = Column(Integer, nullable=True)
    phone_number = Column(String(255), unique=False, nullable=True)
    gender = Column(String(40), nullable=True)

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

    user = relationship("User", back_populates="lifestyle_information")
