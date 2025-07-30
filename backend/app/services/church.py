from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.church import Church
from app.schemas.church import ChurchCreate, ChurchUpdate


def get_church(db: Session, church_id: int) -> Optional[Church]:
    return db.query(Church).filter(Church.id == church_id).first()


def get_churches(db: Session, skip: int = 0, limit: int = 100) -> List[Church]:
    return db.query(Church).offset(skip).limit(limit).all()


def get_churches_by_state(db: Session, state: str, skip: int = 0, limit: int = 100) -> List[Church]:
    return db.query(Church).filter(Church.state.ilike(f"%{state}%")).offset(skip).limit(limit).all()


def get_churches_by_name(db: Session, name: str, skip: int = 0, limit: int = 100) -> List[Church]:
    return db.query(Church).filter(Church.name.ilike(f"%{name}%")).offset(skip).limit(limit).all()


def create_church(db: Session, church: ChurchCreate) -> Church:
    db_church = Church(**church.dict())
    db.add(db_church)
    db.commit()
    db.refresh(db_church)
    return db_church


def update_church(db: Session, church_id: int, church_update: ChurchUpdate) -> Optional[Church]:
    db_church = db.query(Church).filter(Church.id == church_id).first()
    if not db_church:
        return None
    
    update_data = church_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_church, field, value)
    
    db.commit()
    db.refresh(db_church)
    return db_church


def delete_church(db: Session, church_id: int) -> bool:
    db_church = db.query(Church).filter(Church.id == church_id).first()
    if not db_church:
        return False
    
    db.delete(db_church)
    db.commit()
    return True
