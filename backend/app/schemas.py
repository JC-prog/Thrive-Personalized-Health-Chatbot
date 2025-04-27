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

class UserProfileUpdateData(BaseModel):
    # general_data fields
    general_data: Dict[str, Optional[int | str]]

    '''
    phone_number: Optional[str]
    gender: Optional[constr(min_length=1)]
    education: Optional[conint(ge=0)]
    healthcare: Optional[conint(ge=0)]
    income: Optional[conint(ge=0)]

    # clinical_measurement fields
    height: Optional[confloat(ge=0)]
    weight: Optional[confloat(ge=0)]
    bmi: Optional[confloat(ge=0)]
    systolic_bp: Optional[conint(ge=0)]
    diastolic_bp: Optional[conint(ge=0)]
    glucose_level: Optional[conint(ge=0)]
    cholesterol_total: Optional[conint(ge=0)]

    # lifestyle fields
    smoking: Optional[conint(ge=0, le=1)]
    alcohol: Optional[conint(ge=0, le=1)]
    exercise: Optional[conint(ge=0, le=5)]
    vegetable: Optional[conint(ge=0, le=5)]
    fruits: Optional[conint(ge=0, le=5)]

    # medical_history fields
    heart_history: Optional[conint(ge=0, le=1)]
    stroke: Optional[conint(ge=0, le=1)]
    disability: Optional[conint(ge=0, le=1)]
    '''
    class Config:
        orm_mode = True
