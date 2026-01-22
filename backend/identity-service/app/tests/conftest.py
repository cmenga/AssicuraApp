import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
# Root path per import
root_path = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root_path))

# Engine e sessione per test in-memory
from database.session import get_session

from settings import get_local_database_url
TestingSessionLocal = get_session(get_local_database_url())

# Clean data for testing
def clean_data():
    from database.models import User
    db = TestingSessionLocal()

    db.execute(delete(User))
    db.commit()

    db.close()
clean_data()
# App FastAPI
from main import app

# Override dependency DB
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fixture client
@pytest.fixture
def client():
    return TestClient(app)