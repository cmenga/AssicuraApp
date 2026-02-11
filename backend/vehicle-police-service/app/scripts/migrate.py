from subprocess import run
from structlog import get_logger

from pathlib import Path

def get_root_migrate_path() -> str:
    return str(Path(__file__).resolve().parent.parent.parent)

def main():
    """
    The main function initiates the migration process using Alembic for the project.
    It logs the start of the migration, runs the Alembic upgrade command, and logs the completion of the migration.
    @return None
    """
    logger = get_logger()
    root_project = get_root_migrate_path()

    logger.info(
        "Start migration", scripts="migrate", migrate="alembic", path=str(root_project)
    )
    try:
        run(["alembic", "upgrade", "head"], cwd=str(root_project), check=True)
    except Exception as ex:
        logger.exception(
            ex,
            scripts="migrate",
            migrate="alembic",
            path=str(root_project),
        )
        raise ex

    logger.info(
        "Migration completed",
        scripts="migrate",
        migrate="alembic",
        path=str(root_project),
    )