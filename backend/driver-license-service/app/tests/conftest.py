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


@pytest.fixture(autouse=True, scope="session")
def clean_data():
    from database.models import DriverLicense, LicenseCategory

    db = TestingSessionLocal()
    db.execute(delete(DriverLicense))
    db.execute(delete(LicenseCategory))
    db.commit()
    db.close()


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


# Run all script
from scripts.run_all import run_all
@pytest.fixture(autouse=True, scope="session")
def run_scripts():
    run_all()
