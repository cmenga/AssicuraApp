from fastapi.routing import APIRouter
from sqlalchemy import text
from datetime import datetime, timezone

from core.exceptions import HTTPServiceUnavailable
from core.dependencies import DbSession

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health(db: DbSession):
    isDbReady: bool = False
    try:
        db.execute(text("SELECT 1"))
        isDbReady = True
    except Exception as e:
        isDbReady = False
        raise HTTPServiceUnavailable("Database unreachable")

    return {
        "status": "up/running",
        "db": isDbReady,
        "version": "0.0.1",
        "date": datetime.now(timezone.utc),
    }
