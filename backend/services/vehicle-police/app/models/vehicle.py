import uuid
from core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from sqlalchemy import UUID
from sqlalchemy import String
from sqlalchemy import UniqueConstraint

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    license_plate: Mapped[str] = mapped_column(
        String(10), unique=True, index=True, nullable=False
    )
    vin: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    brand: Mapped[str] = mapped_column(String(50), nullable=False)
    model: Mapped[str] = mapped_column(String(50), nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )

    __table_args__ = (UniqueConstraint("vin", "user_id", name="uq_vehicle_owner"),)
