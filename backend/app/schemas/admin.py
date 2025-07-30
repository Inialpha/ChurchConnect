from pydantic import BaseModel, EmailStr


class AdminBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class AdminCreate(AdminBase):
    password: str


class AdminResponse(AdminBase):
    id: int

    class Config:
        from_attributes = True


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
