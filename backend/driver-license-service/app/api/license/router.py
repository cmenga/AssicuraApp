from fastapi import APIRouter, Body, status
from typing import Annotated, List
from sqlalchemy.exc import IntegrityError


from api.dependency import JWToken, DbSession, JWTService
from api.license.schema import DriverLicenseIn, DriverLicenseOut
from api.exceptions import HTTPConflict, HTTPInternalServer
from api.utils import get_driver_licenses
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
        logger.warning(
            "Driver license already exists",
            user_id=payload["sub"],
            license_code=item.license_code,
        )
        raise HTTPConflict("La patente inserita risulta esistente")

    new_license = DriverLicense(
        code=item.license_code,
        number=item.license_number,
        expiry_date=item.expiry_date,
        issue_date=item.issue_date,
        user_id=payload["sub"],
    )

    logger.debug(
        "New driver license entity created",
        user_id=payload["sub"],
        license_code=item.license_code,
    )
    db.add(new_license)

    try:
        db.commit()

        logger.info(
            "Driver license successfully saved",
            user_id=payload["sub"],
            license_code=item.license_code,
        )

    except IntegrityError as ex:
        logger.exception(
            ex,
            user_id=payload["sub"],
            license_code=item.license_code,
        )
        db.rollback()

        raise HTTPInternalServer("Salvataggio nel database non riuscito")


@license_router.delete("/delete", status_code=status.HTTP_200_OK)
async def delete_driver_license(db: DbSession, jwt: JWTService, token: JWToken):
    payload = jwt.decode_access_token(token)
    logger.info("Deleting driver licenses", user_id=payload["sub"])
    fetched_licenses = get_driver_licenses(db, payload)

    try:
        for license in fetched_licenses:
            db.delete(license)
            logger.debug("Deleted license", license_id=str(license.id))

        db.commit()
        logger.info("All driver licenses deleted successfully", user_id=payload["sub"])
    except Exception as ex:
        db.rollback()
        logger.exception(
            "Failed to delete driver licenses", user_id=payload["sub"], error=str(ex)
        )
        raise HTTPInternalServer("Saving to the database failed")

    return {"success": True, "message": "Driver licenses removed successfully"}


@license_router.get("/licenses")
async def get_licenses(
    db: DbSession, token: JWToken, jwt: JWTService
) -> List[DriverLicenseOut]:
    payload = jwt.decode_access_token(token)
    fetched_licenses = get_driver_licenses(db, payload)

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
