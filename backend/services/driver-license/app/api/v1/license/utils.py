from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models import DriverLicense

async def get_driver_licenses(db: AsyncSession, user_id: str):
    statement = select(DriverLicense).filter(DriverLicense.user_id == user_id)
    result = await db.execute(statement)
    return result.scalars().all()