from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Church(Base):
    __tablename__ = "churches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    year_established = Column(Integer)
    state = Column(String(100), nullable=False)
    lga = Column(String(100), nullable=False)
    community = Column(String(100), nullable=False)
    address = Column(Text)
    website = Column(String(255))
    email = Column(String(255))
    phone = Column(String(20))
    facebook = Column(String(255))
    youtube = Column(String(255))
    services = Column(JSON)  # Store as JSON array
    programs = Column(JSON)  # Store as JSON array

    # Relationship with ministers
    ministers = relationship("Minister", back_populates="church")
