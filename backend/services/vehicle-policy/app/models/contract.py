import uuid
from core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import UUID
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import Index
from sqlalchemy import text

from datetime import datetime
from datetime import timezone
from datetime import timedelta

from typing import TYPE_CHECKING
from typing import List
if TYPE_CHECKING:
    from .vehicle import Vehicle
    from .insurance_policy import InsurancePolicy


class Contract(Base):
    __tablename__ = "contracts"
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),nullable=False
    )
    vehicle_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False
    )
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(), nullable=False
    )
    expired_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now() + timedelta(days=365),
        nullable=False,
    )
    is_active: Mapped[Boolean] = mapped_column(Boolean, default=True, nullable=False)

    vehicle: Mapped["Vehicle"] = relationship("Vehicle", back_populates="contracts")
    policies: Mapped[List["InsurancePolicy"]] = relationship(
        "InsurancePolicy", secondary="contract_policies", back_populates="contracts"
    )

    __table_args__ = (
        Index(
            "uq_active_constraint_for_vehicle",
            "vehicle_id",
            unique=True,
            postgresql_where=is_active,
        ),
    )
