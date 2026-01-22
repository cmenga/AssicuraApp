from fastapi import APIRouter

from api.dependency import JwtToken,DbSession

license_router = APIRouter(tags=["driver license"],prefix="/driver-license")

@license_router.post("/add")
async def add_new_driver_license(db: DbSession, token: JwtToken):
    pass