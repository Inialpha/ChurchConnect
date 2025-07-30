from .auth import router as auth_router
from .church import router as church_router
from .minister import router as minister_router

__all__ = ["auth_router", "church_router", "minister_router"]
