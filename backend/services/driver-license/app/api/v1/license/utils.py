from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models import DriverLicense

from fastapi import Request
async def get_driver_licenses(request: Request,db: AsyncSession, user_id: str):
    try:
        statement = select(DriverLicense).filter(DriverLicense.user_id == user_id)
        result = await db.execute(statement)
        return result.scalars().all()
    except Exception as ec:
        request.state.logger.exception(ec)