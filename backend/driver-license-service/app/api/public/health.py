from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime 
from datetime import timezone

from core.dependencies import DbSession
from core.exceptions import HTTPServiceUnavailable

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health(db: DbSession):
    """
    The `health` function checks the database connection and returns a health status with database
    availability information.
    
    Args:
      db (DbSession): The `db` parameter in the `health` function is of type `DbSession`. It is used to
    interact with the database. The function attempts to execute a simple query to check the connection
    to the database and sets the `isDbReady` flag based on the success of this operation. If
    
    Returns:
      The `health` function returns a dictionary with the following keys and values:
    - "status": "up/running"
    - "db": A boolean value indicating whether the database is ready or not
    - "version": "0.0.1"
    - "date": The current date and time in UTC timezone
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
