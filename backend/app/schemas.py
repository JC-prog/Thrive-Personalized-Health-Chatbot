from pydantic import BaseModel, EmailStr,  conint, confloat, constr
from typing import Optional, Dict

# User Registration Input
class UserRegisterInput(BaseModel):
    username: str
    email: EmailStr
    name: str
    password: str

# User Registration Output
class UserRegisterOutput(BaseModel):
    id: int
    username: str
    email: EmailStr
    name: str

    class Config:
        orm_mode = True

# User Login Input
class UserLoginInput(BaseModel):
    username: str
    password: str

# User Login Output
class UserLoginOutput(BaseModel):
    access_token: str
    token_type: str

# User Update Input
class UserUpdateInput(BaseModel):
    age: int
    gender: int
    education: int
    healthcare: int
    income: int
    smoking: int
    alcohol: int
    active_lifestyle: int
    vegetables: int
    fruits: int
    height: float
    weight: float
    systolic_bp: int
    diastolic_bp: int
    glucose_level: int
    cholesterol_total: int
    heart_history: int
    stroke: int
    disability: int

# User Update Output
class UserUpdateOutput(BaseModel):
    status: str
    message: str

# Assessment Verification Input


# Assessment Verfication Output


# Get User Profile Output
class UserProfileOutput(BaseModel):
    id: int
    name: str
    username: str
    age: int
    gender: int
    education: int
    healthcare: int
    income: int
    smoking: int
    alcohol: int
    active_lifestyle: int
    vegetables: int
    fruits: int
    height: float
    weight: float
    bmi: float
    systolic_bp: int
    diastolic_bp: int
    glucose_level: int
    cholesterol_total: int
    heart_history: int
    stroke: int
    disability: int

    class Config:
        orm_mode = True

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


