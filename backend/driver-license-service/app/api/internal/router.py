from fastapi import APIRouter, Path, Depends, status

from api.internal.security import decode_jwt
from api.dependency import DbSession
from api.exceptions import HTTPInternalServer
from database.models import DriverLicense
from settings import logger


internal_router = APIRouter(prefix="/internal", include_in_schema=False)



@internal_router.delete("/delete-licenses/{user_id}", status_code=status.HTTP_200_OK)
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
        raise HTTPInternalServer("Deletion of records failed")

    return {"deleted": len(fetched_licenses)}
