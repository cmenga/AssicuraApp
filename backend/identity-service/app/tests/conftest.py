import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
# Root path per import
root_path = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root_path))

# Engine e sessione per test in-memory
from database.session import get_session
from settings import get_local_database_url
TestingSessionLocal = get_session(get_local_database_url())

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