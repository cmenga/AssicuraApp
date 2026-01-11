import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker

# Root path per import
root_path = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root_path))

# Engine e sessione per test in-memory
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(bind=engine)

# Base metadata
from database.models import Base
Base.metadata.create_all(bind=engine)

# App FastAPI
from main import app
from database.session import get_db

# Override dependency DB
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Fixture client
@pytest.fixture
def client():
    return TestClient(app)
