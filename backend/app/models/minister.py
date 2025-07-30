from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Minister(Base):
    __tablename__ = "ministers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    website = Column(String(255))
    facebook = Column(String(255))
    bio = Column(Text)
    profile_picture = Column(String(255))
    church_id = Column(Integer, ForeignKey("churches.id"))
    role = Column(String(100), nullable=False)
    education = Column(JSON)  # Store as JSON array
    experience = Column(JSON)  # Store as JSON array
    specializations = Column(JSON)  # Store as JSON array

    # Relationship with church
    church = relationship("Church", back_populates="ministers")
