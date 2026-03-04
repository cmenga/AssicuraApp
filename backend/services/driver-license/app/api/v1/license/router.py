from fastapi import APIRouter
from fastapi import status
from fastapi import Request
from fastapi import Body
from fastapi import Path
from fastapi import Depends

from typing import List
from typing import Annotated

from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.core.security import decode_jwt

from app.core.dependencies import DbSession
from app.core.dependencies import AuthenticatedUser

from app.core.exceptions import HTTPConflict
from app.core.exceptions import HTTPInternalServerError
from app.core.exceptions import HTTPNotFound

from app.api.v1.license.utils import get_driver_licenses

from app.api.v1.license.schema import DriverLicenseDetail
from app.api.v1.license.schema import DriverLicenseCreate

from app.models import DriverLicense

router = APIRouter(tags=["driver license"], prefix="/driver-license")


@router.get("/licenses")
async def get_licenses(
    request: Request, db: DbSession, auth: AuthenticatedUser
) -> List[DriverLicenseDetail] | None:
    """
    Retrieves all driver's licenses associated with the logged-in user.

    Args:
        request (Request): The incoming HTTP request, used for logging within utils.
        db (DbSession): The database session for executing queries.
        auth (AuthenticatedUser): The authenticated user's token payload containing the user ID.

    Returns:
        List[DriverLicenseDetail] | None: A list of Pydantic models representing the user's driver's licenses, or None if no licenses are found.
    """
    fetched_licenses = await get_driver_licenses(request, db, auth["sub"])

    if not fetched_licenses:
        return None

    returned_license = list()
    for license in fetched_licenses:
        returned_license.append(
            DriverLicenseDetail(
                id=str(license.id),
                code=license.code,
                expiry_date=license.expiry_date,
                issue_date=license.issue_date,
                number=license.number,
            )
        )
    return returned_license


@router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
async def add_new_driver_license(
    auth: AuthenticatedUser,
    db: DbSession,
    item: Annotated[DriverLicenseCreate, Body()],
):
    """
    Adds a new driver's license for the currently authenticated user.

    This endpoint checks if a license with the same code or number already exists
    before creating a new record linked to the user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload.
        db (DbSession): The database session for executing queries.
        item (DriverLicenseCreate): The payload with the new license details.

    Raises:
        HTTPConflict: If a license with the same code or number already exists.
        HTTPInternalServerError: If the database save operation fails.
    """
    statement = select(DriverLicense).where(
        (DriverLicense.code == item.license_code)
        | (DriverLicense.number == item.license_number)
    )
    result = await db.execute(statement)
    fetched_license = result.scalar()

    if fetched_license:
        raise HTTPConflict("The license entered appears to exist")

    new_license = DriverLicense(
        code=item.license_code,
        number=item.license_number,
        expiry_date=item.expiry_date,
        issue_date=item.issue_date,
        user_id=auth["sub"],
    )
    try:
        db.add(new_license)
        await db.flush()
    except IntegrityError:
        raise HTTPInternalServerError("Save to database failed")


@router.delete("/delete/{license_id}", status_code=status.HTTP_200_OK)
async def delete_driver_license(
    db: DbSession, auth: AuthenticatedUser, license_id: Annotated[str, Path()]
):
    """
    Deletes a specific driver's license.

    Args:
        db (DbSession): The database session for executing queries.
        auth (AuthenticatedUser): The authenticated user's token payload.
        license_id (str): The ID of the license to be deleted.

    Raises:
        HTTPNotFound: If the license is not found.
        HTTPInternalServerError: If the database delete operation fails.
    """
    statement = select(DriverLicense).where(DriverLicense.id == license_id)
    result = await db.execute(statement)
    fetched_license = result.scalar()
    if not fetched_license:
        raise HTTPNotFound("License not found")
    try:
        await db.delete(fetched_license)
    except Exception:
        raise HTTPInternalServerError("Save to database failed")


@router.patch("/update/{license_id}")
async def update_driver_license(
    auth: AuthenticatedUser,
    db: DbSession,
    license_id: Annotated[str, Path()],
    license: Annotated[DriverLicenseCreate, Body()],
):
    """
    Updates the details of a specific driver's license for the logged-in user.

    Args:
        auth (AuthenticatedUser): The authenticated user's token payload.
        db (DbSession): The database session for executing queries.
        license_id (str): The ID of the license to update.
        license (DriverLicenseCreate): The payload with the updated license details.

    Raises:
        HTTPNotFound: If the license is not found for the current user.
        HTTPInternalServerError: If the database update fails.
    """
    statement = select(DriverLicense).where(
        DriverLicense.id == license_id, DriverLicense.user_id == auth["sub"]
    )
    result = await db.execute(statement)
    fetched_license = result.scalar()
    if fetched_license is None:
        raise HTTPNotFound("License not found")

    setattr(fetched_license, "number", license.license_number)
    setattr(fetched_license, "expiry_date", license.expiry_date)
    setattr(fetched_license, "issue_date", license.issue_date)

    try:
        await db.flush()
    except IntegrityError:
        raise HTTPInternalServerError("Save to database failed")


# internal
@router.delete(
    "/internal/delete-licenses/{user_id}",
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def delete_licenses(db: DbSession, _=Depends(decode_jwt), user_id: str = Path()):
    """
    Deletes all driver's licenses associated with a specific user ID (internal use).

    This endpoint is intended to be called by other microservices (e.g., Identity service
    during user deletion).

    Args:
        db (DbSession): The database session for executing queries.
        _ (dict): The decoded JWT payload from the `decode_jwt` dependency (unused).
        user_id (str): The ID of the user whose licenses are to be deleted.

    Returns:
        dict: A dictionary confirming the number of deleted licenses, e.g., `{"deleted": 2}`.

    Raises:
        HTTPInternalServerError: If the database delete operation fails.
    """
    statement = select(DriverLicense).where(DriverLicense.user_id == user_id)
    result = await db.execute(statement)
    fetched_licenses = result.scalars().all()

    if not fetched_licenses:
        return {"deleted": 0}

    try:
        for license in fetched_licenses:
            await db.delete(license)
    except Exception:
        raise HTTPInternalServerError("Deletion of records failed")

    return {"deleted": len(fetched_licenses)}


@router.post(
    "/internal/add/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    include_in_schema=False,
)
async def add_new_license(
    db: DbSession,
    license: Annotated[DriverLicenseCreate, Body()],
    user_id: Annotated[str, Path()],
    _=Depends(decode_jwt),
):
    """
    Adds a new driver's license for a specific user ID (internal use).

    This endpoint is called by the Identity service during user registration. It performs
    checks before adding the license.

    Args:
        db (DbSession): The database session for executing queries.
        license (DriverLicenseCreate): The payload with the new license details.
        user_id (str): The ID of the user to associate the license with.
        _ (dict): The decoded JWT payload from the `decode_jwt` dependency (unused).

    Raises:
        HTTPConflict: If the license already exists for the user.
        HTTPInternalServerError: If the database save operation fails.
    """
    statement = select(DriverLicense).where(
        DriverLicense.user_id == user_id,
        DriverLicense.code == license.license_code,
        DriverLicense.number == license.license_number,
    )

    result = await db.execute(statement)
    fetched_license = result.scalar()

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
        await db.flush()
    except Exception:
        raise HTTPInternalServerError("It was not possible to save the license")
