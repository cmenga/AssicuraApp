from fastapi import APIRouter

from .health.router import router as health_router
from .vehicle.router import router as vehicle_router

router = APIRouter()
router.include_router(health_router)
router.include_router(vehicle_router)