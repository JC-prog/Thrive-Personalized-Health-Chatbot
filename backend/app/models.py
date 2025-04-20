from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=False, nullable=False)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
