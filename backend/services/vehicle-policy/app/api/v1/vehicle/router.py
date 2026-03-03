from fastapi import APIRouter
from fastapi import status
from fastapi import Body
from fastapi import Path

from typing import Annotated
from typing import List

from sqlalchemy import select

from app.core.dependencies import DbSession
from app.core.dependencies import AuthenticatedUser

from app.core.exceptions import HTTPConflict
from app.core.exceptions import HTTPInternalServerError
from app.core.exceptions import HTTPNotFound

from app.models import Vehicle
from app.models import Contract

from app.api.v1.vehicle.schema import VehicleCreate
from app.api.v1.vehicle.schema import VehicleDetail
from app.api.v1.vehicle.schema import VehicleUpdate

router = APIRouter(prefix="/vehicle", tags=["vehicle"])


@router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
async def add_vehicle(
    db: DbSession, auth: AuthenticatedUser, vehicle: Annotated[VehicleCreate, Body()]
) -> None:
    """
    This function adds a new vehicle to the database after checking if it is not already registered.

    Args:
      db (DbSession): The `db` parameter in the `add_vehicle` function is used to access the database
    session. It is of type `DbSession`, which is likely a database session object that allows you to
    interact with the database. In this function, the database session is used to query the database for
    existing vehicles
      auth (AuthenticatedUser): The `auth` parameter in the `add_vehicle` function represents the
    authenticated user making the request. It is of type `AuthenticatedUser` and is used to identify the
    user who is adding a new vehicle. The user's identity is typically extracted from the request
    headers or tokens to ensure that the user
      vehicle (Annotated[VehicleCreate, Body()]): The `vehicle` parameter in the `add_vehicle` function
    represents the data of a new vehicle that is being added to the database. It is of type
    `Annotated[VehicleCreate, Body()]`, which means it is expected to be in the request body and should
    be validated against the `Vehicle
    """
    statement = (
        select(Vehicle)
        .filter(Vehicle.user_id == auth["sub"])
        .filter(Vehicle.vin == vehicle.vin)
    )
    result = await db.execute(statement)
    fetched_vehicle = result.scalar()
    
    if fetched_vehicle:
        raise HTTPConflict("Vehicle already registered")

    try:
        new_vehicle = Vehicle(**vehicle.model_dump(),user_id=auth["sub"])
        db.add(new_vehicle)
        await db.flush()
    except Exception:
        raise HTTPInternalServerError("Save to database failed")


@router.get("/vehicles", status_code=status.HTTP_200_OK)
async def get_vehicles(db: DbSession, auth: AuthenticatedUser) -> List[VehicleDetail]:
    """
    This Python function retrieves vehicles from a database based on the authenticated user and returns
    a list of vehicle details.

    Args:
      db (DbSession): DbSession is a database session object that allows interaction with the database.
      auth (AuthenticatedUser): The `auth` parameter in the `get_vehicles` function is of type
    `AuthenticatedUser`. It is used to authenticate the user and retrieve vehicles associated with the
    authenticated user. The `auth` parameter likely contains information such as the user's ID (`sub`)
    to filter the vehicles belonging to that

    Returns:
      A list of `VehicleDetail` objects is being returned.
    """
    statement = select(Vehicle).filter(Vehicle.user_id == auth["sub"])
    result = await db.execute(statement)
    fetched_vehicles = result.scalars().all()
    
    if fetched_vehicles is None:
        return []

    returned_vehicle: List[VehicleDetail] = []
    for vehicle in fetched_vehicles:
        returned_vehicle.append(VehicleDetail.model_validate(vehicle))
    return returned_vehicle


@router.patch("/update/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_vehicle(
    db: DbSession,
    auth: AuthenticatedUser,
    vehicle_id: Annotated[str, Path()],
    vehicle: Annotated[VehicleUpdate, Body()],
):
    """
    This Python function updates a vehicle record in a database based on the provided data.

    Args:
      db (DbSession): The `db` parameter is used to access the database session within the
    `update_vehicle` function. It is of type `DbSession`, which likely represents a database session
    object that allows you to interact with the database. This parameter is essential for querying and
    updating the database with information related to the vehicles
      auth (AuthenticatedUser): The `auth` parameter in the `update_vehicle` function represents the
    authenticated user making the request. It is of type `AuthenticatedUser` and is used to verify the
    user's identity and permissions before allowing them to update the vehicle information in the
    database.
      vehicle_id (Annotated[str, Path()]): The `vehicle_id` parameter in the code snippet represents the
    unique identifier of the vehicle that needs to be updated. It is extracted from the path of the API
    endpoint `/update/{vehicle_id}`. This identifier is used to locate the specific vehicle in the
    database that the user wants to update.
      vehicle (Annotated[VehicleUpdate, Body()]): The `vehicle` parameter in the `update_vehicle`
    function represents the data that will be used to update a specific vehicle in the database. It is
    expected to be of type `VehicleUpdate` and is annotated with `Body()`, indicating that the data will
    be coming from the request body.
    """
    statement = (
        select(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .filter(Vehicle.user_id == auth["sub"])
    )
    result = await db.execute(statement)
    fetched_vehicle = result.scalar()
    if fetched_vehicle is None:
        raise HTTPNotFound("Vehicle not found")

    for field, value in vehicle.model_dump(exclude_unset=True).items():
        if value is None:
            continue
        setattr(fetched_vehicle, field, value)

    try:
        await db.flush()
    except Exception:
        raise HTTPInternalServerError("The changes could not be saved to the database")


@router.delete("/delete/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(
    db: DbSession, auth: AuthenticatedUser, vehicle_id: Annotated[str, Path()]
):
    statement = (
        select(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .filter(Vehicle.user_id == auth["sub"])
    )
    result = await db.execute(statement)
    fetched_vehicle = result.scalar()

    if fetched_vehicle is None:
        raise HTTPNotFound("Vehicle not found")
    
    statement = select(Contract).where(Contract.vehicle_id == fetched_vehicle.id)
    result = await db.execute(statement)
    fetched_contract = result.scalar()
    
    if fetched_contract:
        raise HTTPConflict("There is already a contract for this vehicle.")
    
    try:
        await db.delete(fetched_vehicle)
    except Exception:
        raise HTTPInternalServerError("Problem with vehicle cancellation")
