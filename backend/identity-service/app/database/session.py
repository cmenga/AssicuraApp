from sqlalchemy.orm import sessionmaker, declarative_base
from database.engine import get_engine


Base = declarative_base()


def get_session(db_url: str | None = None):
    engine = get_engine(db_url)
    return sessionmaker(bind=engine)


