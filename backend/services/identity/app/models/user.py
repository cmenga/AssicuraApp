import uuid
from datetime import date

from app.core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import UUID
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import Boolean
from sqlalchemy import CheckConstraint

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .address import Address
    from .token import Token
    
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    first_name: Mapped[str] = mapped_column(String(40), nullable=False)
    last_name: Mapped[str] = mapped_column(String(40), nullable=False)
    fiscal_id: Mapped[str] = mapped_column(String(16), nullable=False, unique=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    place_of_birth: Mapped[str] = mapped_column(String(150), nullable=False)
    gender: Mapped[str] = mapped_column(String(8), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    accept_privacy_policy: Mapped[bool] = mapped_column(Boolean, nullable=False)
    accept_terms: Mapped[bool] = mapped_column(Boolean, nullable=False)
    subscribe_to_news_letter: Mapped[bool] = mapped_column(Boolean, nullable=False)

    addresses: Mapped[list["Address"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    token: Mapped["Token"] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    __table_args__ = (
        CheckConstraint("gender IN ('male', 'female')", name="ck_users_gender"),
    )
