from fastapi import APIRouter, status, Body, Path
from typing import List, Annotated
from sqlalchemy.orm import Session 
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from core.settings import logger
from core.dependencies import DbSession, AuthenticatedUser
from core.exceptions import HTTPConflict, HTTPInternalServerError, HTTPNotFound
from database.models import DriverLicense
from api.public.schema import DriverLicenseIn, DriverLicenseOut


router = APIRouter(tags=["driver license"],prefix="/driver-license")


# Internal utils
def get_driver_licenses(db: Session, user_id: str):
    licenses = db.query(DriverLicense).filter(DriverLicense.user_id == user_id).all()
    return licenses


@router.get("/licenses")
async def get_licenses(
    db: DbSession, auth: AuthenticatedUser
) -> List[DriverLicenseOut] | None:
    fetched_licenses = get_driver_licenses(db, auth["sub"])

    if not fetched_licenses:
        return None

    returned_license = list()
    for license in fetched_licenses:
        returned_license.append(
            DriverLicenseOut(
                code=license.code,
                number=license.number,
                expiry_date=license.expiry_date,
                issue_date=license.issue_date,
                id=str(license.id),
            )
        )
    return returned_license


@router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
async def add_new_driver_license(
    auth: AuthenticatedUser,
    db: DbSession,
    item: Annotated[DriverLicenseIn, Body()],
):
    fetched_license = (
        db.query(DriverLicense)
        .filter(
            or_(
                DriverLicense.code == item.license_code,
                DriverLicense.number == item.license_number,
            ),
            DriverLicense.user_id == auth["sub"],
        )
        .first()
    )

    if fetched_license:
        raise HTTPConflict("La patente inserita risulta esistente")

    new_license = DriverLicense(
        code=item.license_code,
        number=item.license_number,
        expiry_date=item.expiry_date,
        issue_date=item.issue_date,
        user_id=auth["sub"],
    )
    db.add(new_license)
    try:
        db.commit()
    except IntegrityError as ex:
        logger.exception(ex, user_id=auth["sub"])
        db.rollback()
        raise HTTPInternalServerError("Save to database failed")


@router.delete("/delete/{license_id}", status_code=status.HTTP_200_OK)
async def delete_driver_license(
    db: DbSession, auth: AuthenticatedUser, license_id: Annotated[str, Path()]
):
    fetched_license = (
        db.query(DriverLicense).filter(DriverLicense.id == license_id).first()
    )
    if not fetched_license:
        raise HTTPNotFound("License not found")
    try:
        db.delete(fetched_license)
        db.commit()
    except Exception as ex:
        logger.exception(ex, user_id=auth["sub"])
        db.rollback()
        raise HTTPInternalServerError("Save to database failed")


@router.patch("/update/{license_id}")
async def update_driver_license(
    auth: AuthenticatedUser,
    db: DbSession,
    license_id: Annotated[str, Path()],
    license: Annotated[DriverLicenseIn, Body()],
):
    fetched_license = (
        db.query(DriverLicense).filter(DriverLicense.id == license_id).first()
    )
    if fetched_license is None:
        raise HTTPNotFound("License not found")

    setattr(fetched_license, "number", license.license_number)
    setattr(fetched_license, "expiry_date", license.expiry_date)
    setattr(fetched_license, "issue_date", license.issue_date)

    try:
        db.commit()
    except IntegrityError as ex:
        logger.exception(ex, user_id=auth["sub"])
        db.rollback()
        raise HTTPInternalServerError("Save to database failed")
