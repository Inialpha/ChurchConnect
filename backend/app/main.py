from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routes import auth_router, church_router, minister_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Church Management API",
    description="A comprehensive API for managing churches, ministers, and authentication",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(church_router, prefix="/api/v1")
app.include_router(minister_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Church Management API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
