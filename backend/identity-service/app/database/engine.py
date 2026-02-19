from sqlalchemy import create_engine
from typing import Dict
from typing import Any

_engines:  Dict[str,Any] = {}

def get_engine(db_url: str | None = None):
    """
    The function `get_engine` retrieves or creates a database engine based on the provided URL or a
    default URL.
    
    Args:
      db_url (str | None): The `db_url` parameter in the `get_engine` function is a string that
    represents the URL of the database. It has a default value of `None`, which means if no URL is
    provided when calling the function, it will attempt to retrieve the database URL from the
    `get_database_url`
    
    Returns:
      The `get_engine` function returns the SQLAlchemy engine associated with the provided `db_url`. If
    `db_url` is not provided, it retrieves the database URL from the configuration and then returns the
    engine associated with that URL. If the engine for the given `db_url` does not exist in the
    `_engines` dictionary, a new engine is created using `create_engine` function with `pool
    """
    global _engines
    if db_url is None:
        from core.config import get_database_url
        db_url = get_database_url()
        
    if db_url not in _engines:
        _engines[db_url] = create_engine(db_url,pool_pre_ping=True)
    
    return _engines[db_url]
