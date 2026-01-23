from fastapi import APIRouter, Body, status
from typing import Annotated
from sqlalchemy.exc import IntegrityError

from api.dependency import JWToken, DbSession, JWTService
from api.license.schema import DriverLicenseIn
from api.exceptions import HTTPConflict, HTTPInternalServer
from database.models import DriverLicense
from settings import logger

license_router = APIRouter(tags=["driver license"], prefix="/driver-license")


@license_router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
async def add_new_driver_license(
    db: DbSession,
    jwt: JWTService,
    token: JWToken,
    item: Annotated[DriverLicenseIn, Body()],
):
    payload = jwt.decode_access_token(token)
    fetched_license = (
        db.query(DriverLicense)
        .filter(
            DriverLicense.code == item.license_code,
            DriverLicense.user_id == payload["sub"],
        )
        .first()
    )
    if fetched_license:
        raise HTTPConflict("La patente inserira riuslta esistente")

    new_license = DriverLicense(
        code=item.license_code,
        number=item.license_number,
        expiry_date=item.expiry_date,
        issue_date=item.issue_date,
        user_id=payload["sub"]
    )
    
    db.add(new_license)
    try:
        db.commit()
    except IntegrityError as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServer("Salvataggio nel database non riuscito")
