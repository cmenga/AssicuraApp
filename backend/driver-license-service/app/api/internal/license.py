from fastapi import APIRouter, status, Path, Depends, Body
from typing import Annotated

from api.internal.schema import DriverLicenseIn

from core.security import decode_jwt
from core.dependencies import DbSession
from core.settings import logger
from core.exceptions import HTTPInternalServerError, HTTPConflict

from database.models import DriverLicense

router = APIRouter(prefix="/internal", include_in_schema=False)


@router.delete("/delete-licenses/{user_id}", status_code=status.HTTP_200_OK)
async def delete_licenses(
    db: DbSession, payload=Depends(decode_jwt), user_id: str = Path()
):
    logger.info("Internal request", type=payload["type"], service=payload["sub"])
    fetched_licenses = (
        db.query(DriverLicense).filter(DriverLicense.user_id == user_id).all()
    )
    if not fetched_licenses:
        return {"deleted": 0}

    try:
        for license in fetched_licenses:
            db.delete(license)
        db.commit()
    except Exception as ex:
        db.rollback()
        logger.exception(ex)
        raise HTTPInternalServerError("Deletion of records failed")

    return {"deleted": len(fetched_licenses)}


@router.post("/add/{user_id}", status_code=status.HTTP_200_OK)
async def add_new_license(
    db: DbSession,
    license: Annotated[DriverLicenseIn, Body()],
    user_id: Annotated[str, Path()],
    _=Depends(decode_jwt),
):
    fetched_license = (
        db.query(DriverLicense)
        .filter(DriverLicense.user_id == user_id)
        .filter(DriverLicense.code == license.license_code)
        .filter(DriverLicense.number == license.license_number)
        .first()
    )
    if fetched_license:
        raise HTTPConflict("The license exists in the database")

    new_license = DriverLicense(
        code=license.license_code,
        number=license.license_number,
        issue_date=license.issue_date,
        expiry_date=license.expiry_date,
        user_id=user_id,
    )

    try:
        db.add(new_license)
        db.commit()
    except Exception as ex:
        db.rollback()
        logger.exception(ex)
        raise HTTPInternalServerError("It was not possible to save the license")

    return {"message": "request success", "status": "200"}
