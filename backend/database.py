from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL
DATABASE_URL = "mysql+mysqlconnector://root:@localhost/cloud_app"

# Engine
engine = create_engine(DATABASE_URL, echo=True)

# Session
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base class
Base = declarative_base()
