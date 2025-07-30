from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import List, Optional, Dict, Any
from app.models.minister import Minister
from app.models.church import Church
from app.schemas.minister import MinisterCreate, MinisterUpdate


def get_minister(db: Session, minister_id: int) -> Optional[Minister]:
    return db.query(Minister).options(joinedload(Minister.church)).filter(Minister.id == minister_id).first()


def get_ministers(db: Session, skip: int = 0, limit: int = 100) -> List[Minister]:
    return db.query(Minister).options(joinedload(Minister.church)).offset(skip).limit(limit).all()


def get_ministers_by_church(db: Session, church_id: int, skip: int = 0, limit: int = 100) -> List[Minister]:
    return db.query(Minister).options(joinedload(Minister.church)).filter(
        Minister.church_id == church_id
    ).offset(skip).limit(limit).all()


def get_ministers_by_name(db: Session, name: str, skip: int = 0, limit: int = 100) -> List[Minister]:
    return db.query(Minister).options(joinedload(Minister.church)).filter(
        Minister.first_name.ilike(f"%{name}%") | Minister.last_name.ilike(f"%{name}%")
    ).offset(skip).limit(limit).all()


def get_minister_by_email(db: Session, email: str) -> Optional[Minister]:
    return db.query(Minister).filter(Minister.email == email).first()


def create_minister(db: Session, minister: MinisterCreate) -> Minister:
    db_minister = Minister(**minister.dict())
    db.add(db_minister)
    db.commit()
    db.refresh(db_minister)
    return db_minister


def update_minister(db: Session, minister_id: int, minister_update: MinisterUpdate) -> Optional[Minister]:
    db_minister = db.query(Minister).filter(Minister.id == minister_id).first()
    if not db_minister:
        return None
    
    update_data = minister_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_minister, field, value)
    
    db.commit()
    db.refresh(db_minister)
    return db_minister


def delete_minister(db: Session, minister_id: int) -> bool:
    db_minister = db.query(Minister).filter(Minister.id == minister_id).first()
    if not db_minister:
        return False
    
    db.delete(db_minister)
    db.commit()
    return True


def search_ministers(db: Session, search_query: str, church_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Minister]:
    """
    Advanced search for ministers by name, role, or specializations.
    """
    query = db.query(Minister).options(joinedload(Minister.church))
    
    # Search in name, role, and specializations (JSON field)
    search_filter = or_(
        Minister.first_name.ilike(f"%{search_query}%"),
        Minister.last_name.ilike(f"%{search_query}%"),
        Minister.role.ilike(f"%{search_query}%"),
        Minister.specializations.like(f'%"{search_query}"%')  # Search in JSON array
    )
    query = query.filter(search_filter)
    
    # Filter by church if specified
    if church_id:
        query = query.filter(Minister.church_id == church_id)
    
    return query.offset(skip).limit(limit).all()


def get_unique_roles(db: Session) -> List[str]:
    """
    Get all unique minister roles in the system.
    """
    roles = db.query(Minister.role).distinct().filter(Minister.role.isnot(None)).all()
    return [role[0] for role in roles if role[0]]


def get_minister_statistics(db: Session) -> Dict[str, Any]:
    """
    Get summary statistics about ministers.
    """
    total_ministers = db.query(Minister).count()
    
    # Count by role
    role_counts = db.query(
        Minister.role, 
        func.count(Minister.id)
    ).group_by(Minister.role).all()
    
    # Count by church
    church_counts = db.query(
        Church.name,
        func.count(Minister.id)
    ).join(Minister).group_by(Church.id, Church.name).all()
    
    # Ministers without churches
    ministers_without_church = db.query(Minister).filter(Minister.church_id.is_(None)).count()
    
    return {
        "total_ministers": total_ministers,
        "ministers_by_role": {role: count for role, count in role_counts},
        "ministers_by_church": {church: count for church, count in church_counts},
        "ministers_without_church": ministers_without_church,
        "total_churches_with_ministers": len(church_counts)
    }
