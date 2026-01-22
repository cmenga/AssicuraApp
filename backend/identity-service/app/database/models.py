from sqlalchemy import  Boolean, UUID, String, Date, ForeignKey, Integer, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid 
from datetime import date
from database.session import Base

    
class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(40), nullable=False)
    last_name: Mapped[str] = mapped_column(String(40), nullable=False)
    fiscal_id: Mapped[str] = mapped_column(String(16), nullable=False, unique=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    place_of_birth: Mapped[str] = mapped_column(String(150), nullable=False)
    gender: Mapped[str] = mapped_column(String(8),nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False) 
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False) 
    hashed_password: Mapped[str] = mapped_column(String,nullable=False) 
    accept_privacy_policy: Mapped[bool] = mapped_column(Boolean, nullable=False) 
    accept_terms: Mapped[bool] = mapped_column(Boolean, nullable=False)
    subscribe_to_news_letter: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    addresses: Mapped[list["Address"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint(
            "gender IN ('male', 'female')",
            name="ck_users_gender"
        ),
    )

class Address(Base):
    __tablename__ = "addresses"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    street: Mapped[str] = mapped_column(String(250),nullable=False)
    civic_number: Mapped[str] = mapped_column(String(8), nullable=False)
    cap: Mapped[int] = mapped_column(Integer, nullable=False)
    city: Mapped[str] = mapped_column(String(150), nullable=False)
    province: Mapped[str] = mapped_column(String(150), nullable=False)
    type: Mapped[str] = mapped_column(String(),nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="addresses")

    __tablearg__ = (
        CheckConstraint(
            "type IN ('residence','domicile')",
            name='ck_address_type'
        ),
        UniqueConstraint(
            "user_id","type",
            name="uq_user_address_type"
        )
    )

#TODO: Questi dati non c'entrano con il servizo dell'indentità di una persona, inserirli nel license-service 
# // Patente
# licenseNumber: '',
# licenseIssueDate: '',
# licenseExpiryDate: '',
# licenseCategory: 'B',
