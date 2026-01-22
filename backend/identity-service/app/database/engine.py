from sqlalchemy import create_engine

_engine = None


def get_engine(db_url: str | None = None):
    global _engine
    if _engine is None:
        if db_url is None:
            from settings import get_database_url

            db_url = get_database_url()
        _engine = create_engine(db_url)
    return _engine
