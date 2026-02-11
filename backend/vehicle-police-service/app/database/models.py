from sqlalchemy import Column, Boolean, UUID
from uuid import uuid4

from database.session import Base

class TestModel(Base):
    __tablename__ = "Test"
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
    debug_flag = Column(Boolean, default=False)