from dotenv import load_dotenv
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete

# Fix sysy.path for testing
root_path = Path(__file__).resolve().parents[1]
app_path = Path(__file__).resolve().parents[1] / "app"
sys.path.insert(0, str(root_path))
sys.path.insert(0, str(app_path))
load_dotenv(dotenv_path=root_path / ".env.test")

# launch all scripts
from app.scripts.run_all import run_all

run_all()

# Engine e sessione per test in-memory
from app.database.session import get_session

from app.settings import get_local_database_url
TestingSessionLocal = get_session(get_local_database_url())

# Clean data for testing
def clean_data():
    from app.database.models import User
    db = TestingSessionLocal()

    db.execute(delete(User))
    db.commit()

    db.close()
clean_data()
# App FastAPI
from app.main import app

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
