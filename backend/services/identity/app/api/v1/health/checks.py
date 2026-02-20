from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def check_database(db: AsyncSession) -> tuple[bool, str]:
    try:
        statement = select(1)
        await db.execute(statement)
        return True, "ok"
    except Exception as ex:
        return False, ex.__str__()
