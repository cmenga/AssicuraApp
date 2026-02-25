from fastapi import APIRouter
from fastapi import status
from fastapi import Path
from fastapi import Query

from typing import Annotated
from typing import Literal
from typing import Set
from typing import List
from typing import Sequence

from core.dependencies import DbSession
from core.dependencies import AuthenticatedUser
from core.exceptions import HTTPInternalServerError

from sqlalchemy import select
from models import InsurancePolicy
from models import Contract

from api.v1.contract.utils import check_insurance

router = APIRouter(prefix="/contract",tags=["contract"])


@router.post("/add/{type}", status_code=status.HTTP_204_NO_CONTENT)
async def check_active_polcies(
    db: DbSession,
    auth: AuthenticatedUser,
    type: Annotated[Literal["auto", "moto", "autocarro"], Path()],
    insurance_ids: Annotated[str, Query()],
    vehicle_id: Annotated[str,Query()]
    
):

    int_insurance_ids: List[int] = [int(value) for value in insurance_ids.split(",")]
    policy_ids: Set[int] = set(int_insurance_ids)

    statement = select(InsurancePolicy).filter(InsurancePolicy.vehicle_type == type).filter(InsurancePolicy.id.in_(policy_ids))
    result = await db.execute(statement)
    fetched_policies = result.scalars().all()

    rca_base_id,has_rca_base = check_insurance(fetched_policies, "rca base")
    _,has_rca_full = check_insurance(fetched_policies,"rca massimale alto")

    if has_rca_base and rca_base_id and has_rca_full:
        fetched_policies = [policy for policy in fetched_policies if policy.id != rca_base_id ]

    total_price = sum(policy.price for policy in fetched_policies) 
    try:
        new_contract = Contract(vehicle_id=vehicle_id,total_price=total_price)
        for policy in fetched_policies:
            new_contract.policies.append(policy)
        db.add(new_contract)
        await db.flush()
    except:
        raise HTTPInternalServerError("Error while creating the contract")
    



