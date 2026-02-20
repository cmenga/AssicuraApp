from sqlalchemy import text
from sqlalchemy.orm import Session


def check_database(db: Session) -> tuple[bool, str]:
    try:
        db.execute(text("SELECT 1"))
        return True, "ok"
    except Exception as ex:
        return False, ex.__str__()
