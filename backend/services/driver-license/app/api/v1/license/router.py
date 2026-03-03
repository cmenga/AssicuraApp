from fastapi import APIRouter
from fastapi import status
from fastapi import Request
from fastapi import Body
from fastapi import Path
from fastapi import Depends

from typing import List
from typing import Annotated

from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
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
    statement = select(DriverLicense).filter(
        or_(
            DriverLicense.code == item.license_code,
            DriverLicense.number == item.license_number,
        )
    )
    result = await db.execute(statement)
    fetched_license = result.scalar()

    if fetched_license:
        raise HTTPConflict("La patente inserita risulta esistente")

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
    statement = select(DriverLicense).filter(DriverLicense.id == license_id)
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
    statement = (
        select(DriverLicense)
        .filter(DriverLicense.id == license_id)
        .filter(DriverLicense.user_id == auth["sub"])
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
    This Python function deletes driver licenses associated with a specific user ID from a database
    session.

    Args:
      db (DbSession): The `db` parameter is an instance of a database session that is used to interact
    with the database. It is typically used to query, insert, update, and delete records in the
    database. In this case, it is being used to query and delete `DriverLicense` records associated with
    a specific
      _: The underscore (_) in the function signature is used as a placeholder variable name for the
    dependency injection of the `decode_jwt` function. In this case, it is being used to indicate that
    the result of the `decode_jwt` dependency is not being used within the function body.
      user_id (str): The `user_id` parameter is a string that is expected to be provided as a path
    parameter in the URL when calling the `delete_licenses` endpoint. This parameter is used to identify
    the user whose driver licenses need to be deleted from the database.

    Returns:
      The function `delete_licenses` returns a dictionary with a key "deleted" indicating the number of
    licenses that were deleted. If no licenses were found for the specified user_id, it returns
    {"deleted": 0}.
    """
    statement = select(DriverLicense).filter(DriverLicense.user_id == user_id)
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
    This Python function adds a new driver's license to a database if it does not already exist for a
    given user ID.

    Args:
      db (DbSession): The `db` parameter is an instance of the `DbSession` class, which is used to
    interact with the database. It is typically used to query, add, update, or delete records in the
    database within the context of the current request. In this case, it is being used to query
      license (Annotated[DriverLicenseIn, Body()]): The `license` parameter in the `add_new_license`
    function represents the data of a driver's license that is being added to the database. It includes
    the following fields:
      user_id (Annotated[str, Path()]): The `user_id` parameter in the code snippet represents the user
    ID that is passed in the URL path when making a POST request to add a new driver's license for a
    specific user. This ID is used to associate the new driver's license with the corresponding user in
    the database.
      _: The underscore (_) in the function signature is used as a placeholder variable. In this case,
    it is used to represent the result of the `decode_jwt` dependency, which is being used for
    authentication or authorization purposes. The actual result of `decode_jwt` is not being used in the
    function, so
    """
    statement = (
        select(DriverLicense)
        .filter(DriverLicense.user_id == user_id)
        .filter(DriverLicense.code == license.license_code)
        .filter(DriverLicense.number == license.license_number)
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
