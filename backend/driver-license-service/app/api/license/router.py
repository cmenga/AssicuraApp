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
    """
    Endpoint to create and associate a new driver license to the authenticated user.

    The endpoint checks whether a driver license with the same code already exists
    for the current user. If a duplicate is found, a conflict error is raised.
    In case of database persistence issues, an internal server error is returned.

    Args:
        db (DbSession): Database session injected via dependency.
        jwt (JWTService): Service responsible for decoding JWT access tokens.
        token (JWToken): JWT access token of the authenticated user.
        item (DriverLicenseIn): Driver license data to be created.

    Returns:
        None: This endpoint returns no content on success (HTTP 204).

    Raises:
        HTTPConflict: If a driver license with the same code already exists
            for the authenticated user.
        HTTPInternalServer: If the driver license cannot be saved due to
            a database error.
    """
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
