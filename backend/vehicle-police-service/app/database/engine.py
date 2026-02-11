from sqlalchemy import create_engine
from typing import Dict, Any

_engines:  Dict[str,Any] = {}

def get_engine(db_url: str | None = None):
    """
    Create or retrieve a database engine based on the provided URL. If no URL is provided, it will get the URL from the settings. The engine is stored in a global dictionary for caching purposes.
    @param db_url - The URL of the database (optional, if not provided, it will be fetched from settings)
    @return The database engine
    """
    global _engines
    if db_url is None:
        from core.settings import get_database_url
        db_url = get_database_url()
        
    if db_url not in _engines:
        _engines[db_url] = create_engine(db_url,pool_pre_ping=True)
    
    return _engines[db_url]
