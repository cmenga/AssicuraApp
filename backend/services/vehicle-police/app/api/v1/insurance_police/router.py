from fastapi import APIRouter
from fastapi import status
from fastapi import Path

from typing import Annotated
from typing import Literal
from typing import List

from core.dependencies import DbSession
from core.dependencies import AuthenticatedUser

from sqlalchemy import select
from models import InsurancePolicy

from api.v1.insurance_police.schema import InsurancePoliceDetail

router = APIRouter(prefix="/insurance", tags=["insurance police"])


@router.get("/policies/{type}", status_code=status.HTTP_200_OK)
async def get_existing_policies(
    db: DbSession,
    _: AuthenticatedUser,
    type: Annotated[Literal["auto", "moto", "autocarro"], Path()],
) -> List[InsurancePoliceDetail]:
    statement = select(InsurancePolicy).filter(InsurancePolicy.vehicle_type == type)
    result = await db.execute(statement)
    fetched_policies = result.scalars().all()

    policies: List[InsurancePoliceDetail] = []
    for police in fetched_policies:
        policies.append(police)

    return policies
