from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL
DATABASE_URL = "mysql+mysqlconnector://admin:StrongPassword123@fastapi-db.cxdhoyygvtrd.us-east-1.rds.amazonaws.com:3306/fastapi_db"

# Engine
engine = create_engine(DATABASE_URL, echo=True)

# Session
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base class
Base = declarative_base()
