from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.models import User
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS setup
origins = [
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://98.91.199.191:8000"
    ,
    "http://107.23.136.161:3000"  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Routes
@app.get("/")
def root():
    return {"status": "Backend running"}


@app.post("/users")
def add_user(user: dict, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user["email"]).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(name=user["name"], email=user["email"])
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User added",
        "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email},
    }


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "email": u.email} for u in users]


@app.put("/users/{user_id}")
def update_user(user_id: int, user: dict, db: Session = Depends(get_db)):
    # Find the user
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if new email already exists (excluding current user)
    if "email" in user:
        existing_user = (
            db.query(User)
            .filter(User.email == user["email"], User.id != user_id)
            .first()
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")

    # Update user fields
    if "name" in user:
        db_user.name = user["name"]
    if "email" in user:
        db_user.email = user["email"]

    db.commit()
    db.refresh(db_user)
    return {
        "message": "User updated",
        "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email},
    }


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Find the user
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
