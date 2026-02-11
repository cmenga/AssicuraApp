from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime, timezone

from core.dependencies import DbSession
from core.exceptions import HTTPServiceUnavailable

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health(db: DbSession):
    """
    Define a GET endpoint for health check.
    @param db - The database session.
    @return A dictionary containing the status of the service, database availability, version, and current date.
    """
    isDbReady: bool = False
    try:
        # Esegue query semplice per testare connessione
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
