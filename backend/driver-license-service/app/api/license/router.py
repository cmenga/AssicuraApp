from fastapi import APIRouter, Body, status, Path
from typing import Annotated, List
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError


from api.dependency import DbSession, AuthenticatedUser
from api.license.schema import DriverLicenseIn, DriverLicenseOut
from api.exceptions import HTTPConflict, HTTPInternalServer, HTTPNotFound
from api.utils import get_driver_licenses
from database.models import DriverLicense
from settings import logger

license_router = APIRouter(tags=["driver license"], prefix="/driver-license")


@license_router.get("/licenses")
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


@license_router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
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
        raise HTTPInternalServer("Save to database failed")


@license_router.delete("/delete/{license_id}", status_code=status.HTTP_200_OK)
async def delete_driver_license(db: DbSession, auth: AuthenticatedUser, license_id = Path()):
    fetched_license = db.query(DriverLicense).filter(DriverLicense.id == license_id).first()
    if not fetched_license:
        raise HTTPNotFound("License not found")
    try:
        db.delete(fetched_license)
        db.commit()
    except Exception as ex:
        logger.exception(ex, user_id=auth["sub"])
        db.rollback()
        raise HTTPInternalServer("Save to database failed")