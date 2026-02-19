import uuid

from sqlalchemy import UUID
from sqlalchemy import String
from sqlalchemy import CheckConstraint
from sqlalchemy import Date
from sqlalchemy import UniqueConstraint
from sqlalchemy import SmallInteger
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from datetime import date

from database.session import Base


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


class LicenseCategory(Base):
    __tablename__ = "license_category"
    code: Mapped[str] = mapped_column(String(4), primary_key=True, nullable=False)
    description: Mapped[str] = mapped_column(String(128), nullable=False)
    min_age: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    licenses: Mapped[list["DriverLicense"]] = relationship(back_populates="category")

    __table_args__ = (CheckConstraint("min_age >= 14", name="ck_license_min_age"),)
