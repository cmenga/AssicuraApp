from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from database.engine import get_engine


Base = declarative_base()


def get_session(db_url: str | None = None):
    """
    The function `get_session` returns a sessionmaker object bound to a database engine based on the
    provided URL.

    Args:
      db_url (str | None): The `db_url` parameter is a string that represents the URL of the database.
    It is optional and can be set to `None` if no database URL is provided.

    Returns:
      A sessionmaker object is being returned.
    """
    engine = get_engine(db_url)
    return sessionmaker(bind=engine)


def get_db():
    """
    The function `get_db` returns a database session that is closed after its use.
    """
    SessionLocal = get_session()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
