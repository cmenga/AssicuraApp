from tests.conftest import TestingSessionLocal, pytest, app
from api.dependency import get_db


def ovverife_get_db():
    """
    The function `ovverife_get_db` creates a database session and yields it for use, ensuring the
    session is closed properly afterwards.
    """
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


app.dependency_overrides[get_db] = ovverife_get_db


def test_health_endpoint(client):
    """
    Testa l'endpoint /health.
    Deve restituire 200 OK e {"status": "ok"}.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"db", "status", "date", "version"}
