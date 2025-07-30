from pydantic import BaseModel, EmailStr
from typing import List, Optional


class MinisterBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None
    bio: str
    profile_picture: Optional[str] = None
    church_id: int
    role: str
    education: Optional[List[str]] = []
    experience: Optional[List[str]] = []
    specializations: Optional[List[str]] = []


class MinisterCreate(MinisterBase):
    pass


class MinisterUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    church_id: Optional[int] = None
    role: Optional[str] = None
    education: Optional[List[str]] = None
    experience: Optional[List[str]] = None
    specializations: Optional[List[str]] = None


class MinisterResponse(MinisterBase):
    id: int
    church_name: Optional[str] = None

    class Config:
        from_attributes = True
