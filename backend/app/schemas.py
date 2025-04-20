from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone_number: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone_number: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
