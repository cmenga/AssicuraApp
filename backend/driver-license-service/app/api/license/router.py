from fastapi import APIRouter

from api.dependency import JWToken,DbSession

license_router = APIRouter(tags=["driver license"],prefix="/driver-license")

@license_router.post("/add")
async def add_new_driver_license(db: DbSession, token: JWToken):
    pass