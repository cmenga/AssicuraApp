from fastapi import APIRouter

from .health.router import router as health_router
from .vehicle.router import router as vehicle_router
from .insurance.router import router as insurance_policy_router
from .contract.router import router as contract_router

router = APIRouter()
router.include_router(health_router)
router.include_router(vehicle_router)
router.include_router(insurance_policy_router)
router.include_router(contract_router)
