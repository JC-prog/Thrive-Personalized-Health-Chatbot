from sqlalchemy import Column, Integer, String, ForeignKey
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

class UserGeneralData(Base):
    __tablename__ = "users_general_data"

    id = Column(Integer, ForeignKey("users.id"), primary_key = True)
    age = Column(Integer)
    phone_number = Column(String(255), unique=False, nullable=True)
    gender = Column(String(40), nullable=True)

    user = relationship("User", back_populates="general_data")