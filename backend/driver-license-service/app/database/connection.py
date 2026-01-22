from time import sleep
from sqlalchemy import text

from database.engine import get_engine
from settings import logger


def await_database_ready(timeout: int = 60) -> None:
    """
    The function `await_database_ready` checks if the database is ready within a specified timeout
    period and raises an error if it is unreachable.
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
