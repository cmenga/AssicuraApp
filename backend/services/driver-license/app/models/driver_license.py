import uuid
from core.database import Base
from datetime import date

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import UUID
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import CheckConstraint
from sqlalchemy import UniqueConstraint

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .license_category import LicenseCategory

class DriverLicense(Base):
    __tablename__ = "driver_license"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(
        String(4), ForeignKey("license_category.code"), nullable=False
    )
    number: Mapped[str] = mapped_column(String(length=11), nullable=False, unique=True)
    issue_date: Mapped[date] = mapped_column(Date(), nullable=False)
    expiry_date: Mapped[date] = mapped_column(Date(), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )

    # relationship verso LicenseCategory
    category: Mapped["LicenseCategory"] = relationship(
        "LicenseCategory", back_populates="licenses"
    )

    __table_args__ = (
        CheckConstraint("expiry_date > issue_date", name="ck_license_date_valid"),
        UniqueConstraint("code", "user_id", name="uq_user_driver_license_type"),
    )
