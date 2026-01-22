from sqlalchemy.orm import sessionmaker, declarative_base
from database.engine import get_engine


Base = declarative_base()


def get_session(db_url: str | None = None):
    engine = get_engine(db_url)
    return sessionmaker(bind=engine)


def get_db():
    """
    The function `get_db` creates a database session and yields it for use, ensuring the session is
    closed properly afterwards.
    """
    SessionLocal = get_session()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
