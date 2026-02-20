from fastapi import APIRouter

from .health.router import router as health_router
from .license.router import router as license_router

router = APIRouter()
router.include_router(health_router)
router.include_router(license_router)