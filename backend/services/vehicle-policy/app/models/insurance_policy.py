from app.core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import CheckConstraint
from sqlalchemy import UniqueConstraint

from typing import TYPE_CHECKING
from typing import List
if TYPE_CHECKING:
    from .contract import Contract
class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(String(100), nullable=False)
    description = mapped_column(String(255), nullable=False)
    vehicle_type = mapped_column(String(20), nullable=False)
    price = mapped_column(Float, nullable=False)

    contracts: Mapped[List["Contract"]] = relationship(
        "Contract", secondary="contract_policies", back_populates="policies"
    )

    __table_args__ = (
        CheckConstraint(
            "vehicle_type IN ('auto','moto','autocarro')",
            name="ck_insurance_policies_type",
        ),
        UniqueConstraint("name", "vehicle_type", name="uq_vehicle_police_type"),
    )
