from sqlalchemy.ext.asyncio import AsyncSession
from models import LicenseCategory

categories_to_seed = [
    {"code": "AM", "description": "Ciclomotori (<50cc)", "min_age": 14},
    {"code": "A1", "description": "Moto leggere (125cc)", "min_age": 16},
    {"code": "A2", "description": "Moto medie", "min_age": 18},
    {"code": "A", "description": "Moto potenti (>35kW)", "min_age": 24},
    {"code": "B", "description": "Auto", "min_age": 18},
    {"code": "BE", "description": "Rimorchio con auto", "min_age": 18},
    {"code": "C1", "description": "Camion medi (<7,5t)", "min_age": 18},
    {"code": "C", "description": "Camion (>7,5t)", "min_age": 21},
    {"code": "CE", "description": "Rimorchio con camion", "min_age": 21},
    {"code": "D1", "description": "Minibus <16 posti", "min_age": 21},
    {"code": "D", "description": "Autobus (>16 posti)", "min_age": 24},
    {"code": "DE", "description": "Rimorchio con autobus", "min_age": 24},
]

async def seed(session: AsyncSession):
    for category in categories_to_seed:
        is_exist = await session.get(entity=LicenseCategory,ident=category["code"])
        
        if not is_exist:
            session.add(LicenseCategory(**category, is_active=True))
            await session.flush()