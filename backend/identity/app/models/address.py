import uuid

from core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import UUID
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import CheckConstraint
from sqlalchemy import UniqueConstraint

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User
    
class Address(Base):
    __tablename__ = "addresses"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    street: Mapped[str] = mapped_column(String(250), nullable=False)
    civic_number: Mapped[str] = mapped_column(String(8), nullable=False)
    cap: Mapped[int] = mapped_column(Integer, nullable=False)
    city: Mapped[str] = mapped_column(String(150), nullable=False)
    province: Mapped[str] = mapped_column(String(150), nullable=False)
    type: Mapped[str] = mapped_column(String(), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="addresses")

    __table_args__ = (
        CheckConstraint("type IN ('residence','domicile')", name="ck_address_type"),
        UniqueConstraint("user_id", "type", name="uq_user_address_type"),
    )
