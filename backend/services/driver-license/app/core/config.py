from pathlib import Path 

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel

from typing import List
from typing import Dict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

class DBConfig(BaseModel):
    url: str
    pool_size: int = 10
    max_overflow: int = 20
    
class SecurityConfig(BaseModel):
    secret_key: str
    algorithm: str ="HS256"
    service_secret_key: str
    
class AppConfig(BaseModel):
    service_name: str = "service"
    version: str = "1.0.0"
    environment: str = "development"
    cors_origins: List[str] = []
    
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra="ignore",
        env_file=ENV_PATH,
        env_nested_delimiter="_",
        env_nested_max_split=1,
        env_prefix="SETTINGS_",
    )

    db: DBConfig
    app: AppConfig
    security: SecurityConfig
    trusted_services: Dict[str,str] = {}

settings = Settings() #type: ignore
