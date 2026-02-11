from sqlalchemy.orm import sessionmaker, declarative_base
from database.engine import get_engine


Base = declarative_base()


def get_session(db_url: str | None = None):
    """
    Create a session to interact with the database using the provided database URL.
    @param db_url - The URL of the database to connect to. If None, a default connection will be used.
    @return A sessionmaker object bound to the database engine.
    """
    engine = get_engine(db_url)
    return sessionmaker(bind=engine)


def get_db():
    """
    This function is a generator that yields a database session and ensures that the session is properly closed after its use.
    @return A database session.
    """
    SessionLocal = get_session()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
