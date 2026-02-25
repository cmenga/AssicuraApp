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

from api.v1.insurance.schema import InsurancePolicyDetail


router = APIRouter(prefix="/insurance", tags=["insurance policy"])


@router.get("/policies/{type}", status_code=status.HTTP_200_OK)
async def get_existing_policies(
    db: DbSession,
    _: AuthenticatedUser,
    type: Annotated[Literal["auto", "moto", "autocarro"], Path()],
) -> List[InsurancePolicyDetail]:
    statement = select(InsurancePolicy).filter(InsurancePolicy.vehicle_type == type)
    result = await db.execute(statement)
    fetched_policies = result.scalars().all()

    policies: List[InsurancePolicyDetail] = []
    for policy in fetched_policies:
        policies.append(policy)

    return policies

