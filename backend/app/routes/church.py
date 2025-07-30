from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.church import ChurchCreate, ChurchUpdate, ChurchResponse
from app.services import church as church_service
from app.auth import get_current_admin

router = APIRouter(prefix="/churches", tags=["churches"])


@router.get("/", response_model=List[ChurchResponse])
def read_churches(
    skip: int = 0,
    limit: int = 100,
    state: Optional[str] = Query(None, description="Filter by state"),
    name: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db)
):
    if state:
        churches = church_service.get_churches_by_state(db, state=state, skip=skip, limit=limit)
    elif name:
        churches = church_service.get_churches_by_name(db, name=name, skip=skip, limit=limit)
    else:
        churches = church_service.get_churches(db, skip=skip, limit=limit)
    
    # Add church_name to ministers for response
    for church in churches:
        for minister in church.ministers:
            minister.church_name = church.name
    
    return churches


@router.get("/{church_id}", response_model=ChurchResponse)
def read_church(church_id: int, db: Session = Depends(get_db)):
    db_church = church_service.get_church(db, church_id=church_id)
    if db_church is None:
        raise HTTPException(status_code=404, detail="Church not found")
    
    # Add church_name to ministers for response
    for minister in db_church.ministers:
        minister.church_name = db_church.name
    
    return db_church


@router.post("/", response_model=ChurchResponse)
def create_church(
    church: ChurchCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return church_service.create_church(db=db, church=church)


@router.put("/{church_id}", response_model=ChurchResponse)
def update_church(
    church_id: int,
    church: ChurchUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    db_church = church_service.update_church(db, church_id=church_id, church_update=church)
    if db_church is None:
        raise HTTPException(status_code=404, detail="Church not found")
    return db_church


@router.delete("/{church_id}")
def delete_church(
    church_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    success = church_service.delete_church(db, church_id=church_id)
    if not success:
        raise HTTPException(status_code=404, detail="Church not found")
    return {"message": "Church deleted successfully"}
