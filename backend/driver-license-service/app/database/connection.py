from time import sleep
from sqlalchemy import text

from database.engine import get_engine
from core.logging import logger

def await_database_ready(timeout: int = 60) -> None:
    """
    Wait for the database to be ready by checking the connection.
    @param timeout - the maximum time to wait for the database to be ready (default is 60 seconds)
    @return None
    """
    logger.debug("startup.database_check")
    engine = get_engine()
    for attempt in range(timeout):
        try:
            with engine.begin() as conn:
                conn.execute(text("SELECT 1"))
                logger.info("startup.database_ready")
                return
        except Exception as exc:
            logger.warning(
                "startup.database_not_ready",
                attempt=attempt + 1,
                error=str(exc),
            )
            sleep(1)

    logger.critical("startup.database_unreachable")
    raise ConnectionError("Database not reachable")
