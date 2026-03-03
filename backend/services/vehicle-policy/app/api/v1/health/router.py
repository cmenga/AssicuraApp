from fastapi import APIRouter
from fastapi import status
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.dependencies import DbSession

from app.api.v1.health.checks import check_database

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", status_code=status.HTTP_200_OK)
def health():
    return {
        "service": settings.app.service_name,
        "version": settings.app.version,
        "environment": settings.app.environment,
        "status": "ok",
    }


@router.get("/live")
def liveness():
    return {
        "service": settings.app.service_name,
        "version": settings.app.version,
        "status": "alive",
    }


@router.get("/ready")
async def readiness(db: DbSession):
    checks = {}

    db_ok, db_status = await check_database(db)
    checks["database"] = db_status

    overall_status = "ready" if db_ok else "not_ready"

    response_body = {
        "service": settings.app.service_name,
        "version": settings.app.version,
        "status": overall_status,
        "checks": checks,
    }

    if not db_ok:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=response_body
        )

    return response_body
