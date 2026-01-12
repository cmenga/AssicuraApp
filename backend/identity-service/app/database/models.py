from sqlalchemy import Column, Boolean, UUID, String, Date, Enum as PostgresqlEnum
from uuid import uuid4

from database.session import Base
from enum import Enum
class GenderEnum(Enum):
    MALE = "Maschio"
    FEMALE = "Femmina"
    
class User(Base):
    __tablename__ = "user"
    
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    first_name = Column(String(40), nullable=False)
    last_name = Column(String(40), nullable=False)
    fiscal_id = Column(String(16), nullable=False, unique=True)
    date_of_birth = Column(Date, nullable=False)
    place_of_birth = Column(String(150), nullable=False)
    gender = Column(PostgresqlEnum(GenderEnum), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone_number = Column(String(15), nullable=False)
    hashed_password = Column(String,nullable=False)
    accept_privacy_policy = Column(Boolean, nullable=False)
    accept_terms = Column(Boolean, nullable=False)
    subscribe_to_news_letter = Column(Boolean, nullable=False)
    
# // Dati personali

# // Contatti

# // Residenza
# street: '',
# civicNumber: '',
# cap: '',
# city: '',
# province: '',
# // Patente
# licenseNumber: '',
# licenseIssueDate: '',
# licenseExpiryDate: '',
# licenseCategory: 'B',
