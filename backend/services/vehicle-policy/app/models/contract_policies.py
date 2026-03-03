from sqlalchemy import Table
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

contract_policies = Table(
    "contract_policies",
    Base.metadata,
    Column(
        "contract_id",
        UUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "policy_id",
        Integer,
        ForeignKey("insurance_policies.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
