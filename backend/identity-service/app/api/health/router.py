from datetime import datetime, timezone
from fastapi.routing import APIRouter
from fastapi.exceptions import HTTPException
from sqlalchemy import text

from api.dependency import DbSession

health_router = APIRouter(prefix="/health", tags=["Health"])


@health_router.get("")
async def health(db: DbSession):
    isDbReady: bool = False
    try:
        # Esegue query semplice per testare connessione
        db.execute(text("SELECT 1"))
        isDbReady = True
    except Exception as e:
        isDbReady = False
        raise HTTPException(status_code=503, detail="Database unreachable")

    return {
        "status": "up/running",
        "db": isDbReady,
        "version": "0.0.1",
        "date": datetime.now(timezone.utc),
    }
