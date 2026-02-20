from core.database import Base

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from sqlalchemy import String
from sqlalchemy import SmallInteger
from sqlalchemy import Boolean
from sqlalchemy import CheckConstraint

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .driver_license import DriverLicense

class LicenseCategory(Base):
    __tablename__ = "license_category"
    code: Mapped[str] = mapped_column(String(4), primary_key=True, nullable=False)
    description: Mapped[str] = mapped_column(String(128), nullable=False)
    min_age: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    licenses: Mapped[list["DriverLicense"]] = relationship(back_populates="category")

    __table_args__ = (CheckConstraint("min_age >= 14", name="ck_license_min_age"),)
