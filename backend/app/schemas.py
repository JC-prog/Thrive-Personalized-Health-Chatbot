from pydantic import BaseModel, EmailStr
from typing import Optional

# Authentication
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    name: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    name: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Chatbot
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# User Information
class UserProfileGeneralDataOut(BaseModel):
    age: Optional[int]
    phone_number: Optional[str]
    gender: Optional[str]

    class Config:
        orm_mode = True

class UserProfileClinicalMeasurementOut(BaseModel):
    height: Optional[int]
    weight: Optional[int]
    bmi: Optional[int]
    systolic_bp: Optional[int]
    diastolic_bp: Optional[int]
    glucose_level: Optional[int]
    cholesterol_total: Optional[int]

    class Config:
        orm_mode = True

class UserProfileOut(BaseModel):
    id: int
    name: str
    username: str
    email: str
    general_data: Optional[UserProfileGeneralDataOut] = None
    clinical_measurement: Optional[UserProfileClinicalMeasurementOut] = None

    class Config:
        orm_mode = True


