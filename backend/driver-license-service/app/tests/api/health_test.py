from tests.conftest import app, override_get_db
from api.dependency import get_db



app.dependency_overrides[get_db] = override_get_db


def test_health_endpoint(client):
    """
    Testa l'endpoint /health.
    Deve restituire 200 OK e {"status": "ok"}.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"db", "status", "date", "version"}
