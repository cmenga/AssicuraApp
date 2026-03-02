import pytest_asyncio
# Path configurtation for pytest, search app path and service path
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent


from pydantic import BaseModel
from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict
from typing import List

class DBConfig(BaseModel):
    url: str
    pool_size: int = 10
    max_overflow: int = 20


class SecurityConfig(BaseModel):
    secret_key: str
    algorithm: str = "HS256"
    service_secret_key: str


class AppConfig(BaseModel):
    service_name: str = "service"
    version: str = "1.0.0"
    environment: str = "development"
    cors_origins: List[str] = []


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra="ignore",
        env_file=BASE_DIR / ".env.test",
        env_nested_delimiter="_",
        env_nested_max_split=1,
        env_prefix="SETTINGS_",
    )

    db: DBConfig
    security: SecurityConfig
    app: AppConfig


settings = Settings()  # type: ignore
# DEBUG: to see the values ​​of settings
# from json import dumps
# print(dumps(settings.model_dump(),indent=3))
# Updated url for test migrations

# Database configuration
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine

class AsyncDBSession:
    def __init__(self, factory) -> None:
        self.session_factory = factory
        self.session: AsyncSession | None 

    async def __aenter__(self):
        self.session = self.session_factory()
        return self.session

    async def __aexit__(self, exc_type, exc, tb):
        if self.session is None:
            return False
        try:
            if exc_type:
                await self.session.rollback()
            else:
                try:
                    await self.session.commit()
                except:
                    await self.session.rollback()
                    raise
        finally:
            if self.session:
                await self.session.close()
                self.session = None
        return False


@pytest_asyncio.fixture(scope="session")
async def engine():
    async_engine = create_async_engine(settings.db.url)
    yield async_engine
    await async_engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def db_session_factory(engine):
    return async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


# async def reset_db(async_engine: AsyncEngine):
#     async with async_engine.begin() as conn:
#         await conn.run_sync(models.Base.metadata.drop_all)
#         await conn.run_sync(models.Base.metadata.create_all)


# App configuration
from httpx import AsyncClient
from httpx import ASGITransport


@pytest_asyncio.fixture(scope="session")
async def setup_db(engine):
    from app.models import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@pytest_asyncio.fixture(scope="session")
async def async_client(db_session_factory):
    
    async def ovveride_get_db() -> AsyncGenerator[AsyncSession | None]:
        async with AsyncDBSession(db_session_factory) as session:
            yield session
    # Changing information to launch the application under test
    from app import main
    from app.core import dependencies

    main.startup = lambda: NotImplemented
    main.app.dependency_overrides[dependencies.get_db] = ovveride_get_db

    async with AsyncClient(
        transport=ASGITransport(app=main.app), base_url="http://test"
    ) as client:
        yield client
