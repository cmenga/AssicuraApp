from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker

from sqlalchemy.orm import declarative_base
from core.config import settings

async_engine = create_async_engine(
    settings.db.url,
    pool_size=settings.db.pool_size,
    max_overflow=settings.db.max_overflow,
)


async_session = async_sessionmaker(bind=async_engine, class_=AsyncSession)

Base = declarative_base()


class AsyncDBSession:
    def __init__(self) -> None:
        self.session: AsyncSession | None

    async def __aenter__(self):
        self.session = async_session()
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


async def get_db() -> AsyncGenerator[AsyncSession|None]:
    async with AsyncDBSession() as session:
        yield session