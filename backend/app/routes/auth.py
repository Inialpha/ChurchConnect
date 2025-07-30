from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.settings import settings
from app.schemas.admin import AdminCreate, AdminResponse, Token
from app.services import admin as admin_service
from app.auth.utils import authenticate_admin, create_access_token
from pydantic import BaseModel


router = APIRouter(prefix="/auth", tags=["authentication"])


class LoginSchema(BaseModel):
    email: str
    password: str

async def get_credentials(request: Request):
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        print(body)
        try:
            return LoginSchema(**body)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON body")

    elif "application/x-www-form-urlencoded" in content_type:
        form = await request.form()
        return LoginSchema(email=form.get("username"), password=form.get("password"))

    else:
        raise HTTPException(status_code=415, detail="Unsupported content type")


@router.post("/signup", response_model=AdminResponse)
def signup(admin: AdminCreate, db: Session = Depends(get_db)):
    db_admin = admin_service.get_admin_by_email(db, email=admin.email)
    if db_admin:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return admin_service.create_admin(db=db, admin=admin)


@router.post("/login", response_model=Token)
def login(form_data: LoginSchema = Depends(get_credentials), db: Session = Depends(get_db)):
    admin = authenticate_admin(db, form_data.email, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
