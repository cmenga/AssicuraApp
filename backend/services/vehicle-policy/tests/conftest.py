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


# App configuration
import inspect
from httpx import AsyncClient
from httpx import ASGITransport
from fastapi.responses import JSONResponse
from functools import wraps
from typing import Callable


def as_mock_for(original_func):
    def decorator(mock_func):
        mock_func.__signature__ = inspect.signature(original_func)

        @wraps(original_func)
        async def wrapper(*args, **kwargs):
            return await mock_func(*args, **kwargs)

        return wrapper

    return decorator


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db(engine):
    from app import models

    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.drop_all)
        await conn.run_sync(models.Base.metadata.create_all)


@pytest_asyncio.fixture(scope="session")
async def async_client(db_session_factory):
    # Changing information to launch the application under test
    from app import main
    from app.data import seed_insurance_policies
    from app.core import dependencies
    from app.core import exceptions as exc
    # Creation of functions for creating overrides
    @as_mock_for(dependencies.call_internal_service)
    async def call_internal_service(*args, **kwargs):
        return JSONResponse(status_code=200, content={"Mock": True})

    # Create override fucntion
    async def override_get_db() -> AsyncGenerator[AsyncSession | None]:
        async with AsyncDBSession(db_session_factory) as session:
            yield session

    def override_internal_call() -> Callable:
        return call_internal_service
    
    @as_mock_for(dependencies.get_access_token)
    async def override_get_access_token(*args, **kwargs):
        return dependencies.AccessToken(
            {
                "sub": "6fc35532-18be-424e-96c6-16149dc72f1b",
                "email": "mock_email",
                "exp": "mock_exp",
            }
        )
    # Executes the functions declared in startup
    try:
        async with AsyncDBSession(db_session_factory) as session:
            await seed_insurance_policies.seed(session)#type: ignore
    except Exception as ex:
        raise exc.HTTPServiceUnavailable("The service is currently unreachable")
    main.startup = None
    main.app.dependency_overrides[dependencies.get_db] = override_get_db
    main.app.dependency_overrides[dependencies.get_access_token] = override_get_access_token
    main.app.dependency_overrides[dependencies.internal_call] = override_internal_call

    async with AsyncClient(
        transport=ASGITransport(app=main.app), base_url="http://test"
    ) as client:
        yield client
