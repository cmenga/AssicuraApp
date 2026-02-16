from fastapi import APIRouter, status, Body, Path
from typing import Annotated, List

from core.dependencies import DbSession, AuthenticatedUser
from core.exceptions import HTTPConflict, HTTPInternalServerError, HTTPNotFound
from core.settings import logger

from database.models import Vehicle


from api.public.schema import VehicleCreate, VehicleDetail, VehicleUpdate

router = APIRouter(prefix="/vehicle", tags=["vehicle"])


@router.post("/add", status_code=status.HTTP_204_NO_CONTENT)
async def add_vehicle(
    db: DbSession, auth: AuthenticatedUser, vehicle: Annotated[VehicleCreate, Body()]
) -> None:
    fetched_vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.user_id == auth["sub"])
        .filter(Vehicle.vin == vehicle.vin)
        .first()
    )
    if fetched_vehicle:
        raise HTTPConflict("Vehicle already registered")

    try:
        new_vehicle = Vehicle(**vehicle.model_dump())
        db.add(new_vehicle)
        db.commit()
    except Exception as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServerError("Save to database failed")


@router.get("/vehicles", status_code=status.HTTP_200_OK)
async def get_vehicles(db: DbSession, auth: AuthenticatedUser) -> List[VehicleDetail]:
    fetched_vehicles = db.query(Vehicle).filter(Vehicle.user_id == auth["sub"]).all()
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
    fetched_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).filter(Vehicle.user_id == auth["sub"]).first()
    if fetched_vehicle is None:
        raise HTTPNotFound("Vehicle not found")

    for field, value in vehicle.model_dump(exclude_unset=True).items():
        if value is None: 
            continue
        setattr(fetched_vehicle, field, value)

    try:
        db.commit()
    except Exception as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServerError("The changes could not be saved to the database")


#TODO: deve controllare che non abbia assicurazioni a suo carico
@router.delete('/delete/{vehicle_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(db: DbSession, auth: AuthenticatedUser, vehicle_id: Annotated[str, Path()]):
    fetched_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).filter(Vehicle.user_id == auth["sub"]).first()
    
    if fetched_vehicle is None:
        raise HTTPNotFound("Vehicle not found")
    
    try:
        db.delete(fetched_vehicle)
        db.commit()
    except Exception as ex:
        logger.exception(ex)
        db.rollback()
        raise HTTPInternalServerError("Problem with vehicle cancellation")
