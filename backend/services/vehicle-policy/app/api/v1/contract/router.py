from fastapi import APIRouter
from fastapi import status
from fastapi import Path
from fastapi import Query

from typing import Annotated
from typing import Literal
from typing import Set
from typing import List

from app.core.dependencies import DbSession
from app.core.dependencies import AuthenticatedUser

from app.core.exceptions import HTTPInternalServerError
from app.core.exceptions import HTTPNotFound
from app.core.exceptions import HTTPConflict

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models import InsurancePolicy
from app.models import Contract


from app.api.v1.contract.utils import check_insurance

router = APIRouter(prefix="/contract", tags=["contract"])


@router.post("/add/{type}", status_code=status.HTTP_204_NO_CONTENT)
async def check_active_polcies(
    db: DbSession,
    auth: AuthenticatedUser,
    type: Annotated[Literal["auto", "moto", "autocarro"], Path()],
    insurance_ids: Annotated[str, Query()],
    vehicle_id: Annotated[str, Query()],
):
    IPolicy = InsurancePolicy
    statement = select(Contract).where(Contract.vehicle_id == vehicle_id)
    result = await db.execute(statement)
    fetched_contract = result.scalar_one_or_none()
    
    if fetched_contract:
        raise HTTPConflict("There is already a contract for this vehicle")
    
    int_insurance_ids: List[int] = [int(value) for value in insurance_ids.split(",")]
    policy_ids: Set[int] = set(int_insurance_ids)

    statement = (
        select(IPolicy)
        .where(IPolicy.vehicle_type == type)
        .where(IPolicy.id.in_(policy_ids))
    )
    result = await db.execute(statement)
    fetched_policies = result.scalars().all()

    rca_base_id, has_rca_base = check_insurance(fetched_policies, "rca base")
    _, has_rca_full = check_insurance(fetched_policies, "rc massimale alto")

    if has_rca_base and has_rca_full:
        fetched_policies = [
            policy for policy in fetched_policies if policy.id != rca_base_id
        ]

    total_price = sum(policy.price for policy in fetched_policies)
    try:
        new_contract = Contract(
            vehicle_id=vehicle_id, total_price=total_price, owner_id=auth["sub"]
        )
        for policy in fetched_policies:
            new_contract.policies.append(policy)
        db.add(new_contract)
        await db.flush()
    except:
        raise HTTPInternalServerError(f"Error while creating the contract")


@router.get("/all", status_code=status.HTTP_200_OK)
async def get_contracts(db: DbSession, auth: AuthenticatedUser):
    statement = select(Contract).filter(Contract.owner_id == auth["sub"])
    result = await db.execute(statement)
    fetched_contracts = result.scalars().all()

    return fetched_contracts


@router.get("/policies/{contract_id}", status_code=status.HTTP_200_OK)
async def get_insurance_policies(
    db: DbSession, _: AuthenticatedUser, contract_id: Annotated[str, Path()]
):
    statement = (
        select(Contract)
        .options(selectinload(Contract.policies))
        .where(Contract.id == contract_id)
    )
    result = await db.execute(statement)
    fetched_contract = result.scalar_one_or_none()

    if fetched_contract is None:
        raise HTTPNotFound("There are no elements for this contract")

    policies = fetched_contract.policies

    return policies
