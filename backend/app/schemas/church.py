from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from .minister import MinisterResponse


class ServiceSchema(BaseModel):
    day: str
    time: str
    type: str


class ChurchBase(BaseModel):
    name: str
    description: Optional[str] = None
    year_established: Optional[int] = None
    state: str
    lga: str
    community: str
    address: Optional[str] = None
    website: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    services: Optional[List[Dict[str, Any]]] = []
    programs: Optional[List[str]] = []


class ChurchCreate(ChurchBase):
    pass


class ChurchUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    year_established: Optional[int] = None
    state: Optional[str] = None
    lga: Optional[str] = None
    community: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    services: Optional[List[Dict[str, Any]]] = None
    programs: Optional[List[str]] = None


class ChurchResponse(ChurchBase):
    id: int
    ministers: List[MinisterResponse] = []

    class Config:
        from_attributes = True
