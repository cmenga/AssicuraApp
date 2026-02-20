from fastapi import APIRouter

from .health.router import router as health_router
from .auth.router import router as auth_router
from .user.router import router as user_router

router = APIRouter()
router.include_router(health_router)
router.include_router(auth_router)
router.include_router(user_router)