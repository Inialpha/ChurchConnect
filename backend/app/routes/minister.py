from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.minister import MinisterCreate, MinisterUpdate, MinisterResponse
from app.services import minister as minister_service, church as church_service
from app.auth import get_current_admin

router = APIRouter(prefix="/ministers", tags=["ministers"])


@router.get("/", response_model=List[MinisterResponse])
def read_ministers(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    church_id: Optional[int] = Query(None, description="Filter by church ID"),
    name: Optional[str] = Query(None, min_length=1, description="Search by first name or last name"),
    role: Optional[str] = Query(None, description="Filter by minister role"),
    db: Session = Depends(get_db)
):
    """
    Retrieve ministers with optional filtering.
    
    - **church_id**: Filter ministers by specific church
    - **name**: Search ministers by first name or last name (case-insensitive)
    - **role**: Filter by minister role (Pastor, Assistant Pastor, etc.)
    - **skip**: Pagination offset
    - **limit**: Maximum results per page
    """
    if church_id:
        ministers = minister_service.get_ministers_by_church(
            db, church_id=church_id, skip=skip, limit=limit
        )
    elif name:
        ministers = minister_service.get_ministers_by_name(
            db, name=name, skip=skip, limit=limit
        )
    else:
        ministers = minister_service.get_ministers(db, skip=skip, limit=limit)
    
    # Add church_name to response
    for minister in ministers:
        if minister.church:
            minister.church_name = minister.church.name
    
    return ministers


@router.get("/search", response_model=List[MinisterResponse])
def search_ministers(
    q: str = Query(..., min_length=1, description="Search query for name, role, or specialization"),
    church_id: Optional[int] = Query(None, description="Limit search to specific church"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Advanced search for ministers by name, role, or specializations.
    """
    ministers = minister_service.search_ministers(
        db, search_query=q, church_id=church_id, skip=skip, limit=limit
    )
    
    # Add church_name to response
    for minister in ministers:
        if minister.church:
            minister.church_name = minister.church.name
    
    return ministers


@router.get("/{minister_id}", response_model=MinisterResponse)
def read_minister(minister_id: int, db: Session = Depends(get_db)):
    """
    Get a specific minister by ID with their church information.
    """
    db_minister = minister_service.get_minister(db, minister_id=minister_id)
    if db_minister is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Minister with ID {minister_id} not found"
        )
    
    # Add church_name to response
    if db_minister.church:
        db_minister.church_name = db_minister.church.name
    
    return db_minister


@router.post("/", response_model=MinisterResponse, status_code=201)
def create_minister(
    minister: MinisterCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Create a new minister. Requires admin authentication.
    
    - Validates that the church exists
    - Ensures email uniqueness
    - Returns the created minister with church information
    """
    # Validate church exists
    church = church_service.get_church(db, church_id=minister.church_id)
    if not church:
        raise HTTPException(
            status_code=400, 
            detail=f"Church with ID {minister.church_id} does not exist"
        )
    
    # Check if email already exists
    existing_minister = minister_service.get_minister_by_email(db, email=minister.email)
    if existing_minister:
        raise HTTPException(
            status_code=400, 
            detail=f"Minister with email {minister.email} already exists"
        )
    
    db_minister = minister_service.create_minister(db=db, minister=minister)
    
    # Add church_name to response
    if db_minister.church:
        db_minister.church_name = db_minister.church.name
    
    return db_minister


@router.put("/{minister_id}", response_model=MinisterResponse)
def update_minister(
    minister_id: int,
    minister_update: MinisterUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Update an existing minister. Requires admin authentication.
    
    - Validates that the minister exists
    - If updating church_id, validates the new church exists
    - If updating email, ensures uniqueness
    """
    # Check if minister exists
    existing_minister = minister_service.get_minister(db, minister_id=minister_id)
    if not existing_minister:
        raise HTTPException(
            status_code=404, 
            detail=f"Minister with ID {minister_id} not found"
        )
    
    # Validate church exists if updating church_id
    if minister_update.church_id is not None:
        church = church_service.get_church(db, church_id=minister_update.church_id)
        if not church:
            raise HTTPException(
                status_code=400, 
                detail=f"Church with ID {minister_update.church_id} does not exist"
            )
    
    # Check email uniqueness if updating email
    if minister_update.email:
        email_check = minister_service.get_minister_by_email(db, email=minister_update.email)
        if email_check and email_check.id != minister_id:
            raise HTTPException(
                status_code=400, 
                detail=f"Minister with email {minister_update.email} already exists"
            )
    
    db_minister = minister_service.update_minister(
        db, minister_id=minister_id, minister_update=minister_update
    )
    
    # Add church_name to response
    if db_minister.church:
        db_minister.church_name = db_minister.church.name
    
    return db_minister


@router.delete("/{minister_id}", status_code=204)
def delete_minister(
    minister_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Delete a minister. Requires admin authentication.
    
    Returns 204 No Content on successful deletion.
    """
    # Check if minister exists first
    existing_minister = minister_service.get_minister(db, minister_id=minister_id)
    if not existing_minister:
        raise HTTPException(
            status_code=404, 
            detail=f"Minister with ID {minister_id} not found"
        )
    
    success = minister_service.delete_minister(db, minister_id=minister_id)
    if not success:
        raise HTTPException(
            status_code=500, 
            detail="Failed to delete minister"
        )
    
    return None  # 204 No Content


@router.get("/by-church/{church_id}", response_model=List[MinisterResponse])
def get_ministers_by_church(
    church_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[str] = Query(None, description="Filter by role within the church"),
    db: Session = Depends(get_db)
):
    """
    Get all ministers for a specific church.
    
    - **church_id**: The church ID to get ministers for
    - **role**: Optional filter by minister role
    """
    # Validate church exists
    church = church_service.get_church(db, church_id=church_id)
    if not church:
        raise HTTPException(
            status_code=404, 
            detail=f"Church with ID {church_id} not found"
        )
    
    ministers = minister_service.get_ministers_by_church(
        db, church_id=church_id, skip=skip, limit=limit
    )
    
    # Filter by role if specified
    if role:
        ministers = [m for m in ministers if m.role.lower() == role.lower()]
    
    # Add church_name to response
    for minister in ministers:
        minister.church_name = church.name
    
    return ministers


@router.get("/roles/list")
def get_minister_roles(db: Session = Depends(get_db)):
    """
    Get a list of all unique minister roles in the system.
    """
    roles = minister_service.get_unique_roles(db)
    return {"roles": roles}


@router.get("/stats/summary")
def get_minister_stats(db: Session = Depends(get_db)):
    """
    Get summary statistics about ministers.
    """
    stats = minister_service.get_minister_statistics(db)
    return stats
