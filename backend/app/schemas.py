from pydantic import BaseModel, EmailStr

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
    username_or_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Chatbot
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str