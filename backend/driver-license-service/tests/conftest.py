import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient


# Fix root path and app path import
root_path = Path(__file__).resolve().parents[1]
app_path = root_path / "app"
sys.path.insert(0, str(root_path))
sys.path.insert(0, str(app_path))

# Import test env
from dotenv import load_dotenv

test_env = root_path / ".env.test"
load_dotenv(test_env)


# Data cleaning for each test session
from app.database.session import get_session
from app.settings import get_local_database_url

TestingSessionLocal = get_session(get_local_database_url())

# @pytest.fixture(autouse=True, scope="session")
# def clean_data():
#     from app.database.models import DriverLicense, LicenseCategory
#     from sqlalchemy import delete

#     db = TestingSessionLocal()     
#     db.execute(delete(DriverLicense))
#     db.execute(delete(LicenseCategory))
#     db.commit()
#     db.close()

    
    

# Run all script
from app.scripts.run_all import run_all
run_all()


# Fixature for app FastAPI
from app.main import app
from app.api.dependency import get_db


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
