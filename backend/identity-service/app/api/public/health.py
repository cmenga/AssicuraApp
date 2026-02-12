from fastapi import APIRouter
from datetime import datetime,timezone
from sqlalchemy import text

from core.dependencies import DbSession
from core.exceptions import HTTPServiceUnavailable

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def health(db: DbSession):
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
