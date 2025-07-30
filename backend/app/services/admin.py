from sqlalchemy.orm import Session
from typing import Optional
from app.models.admin import Admin
from app.schemas.admin import AdminCreate
from app.auth.utils import get_password_hash


def get_admin_by_email(db: Session, email: str) -> Optional[Admin]:
    return db.query(Admin).filter(Admin.email == email).first()


def create_admin(db: Session, admin: AdminCreate) -> Admin:
    hashed_password = get_password_hash(admin.password)
    db_admin = Admin(
        first_name=admin.first_name,
        last_name=admin.last_name,
        email=admin.email,
        hashed_password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin
