def test_health_endpoint(client):
    """
    Testa l'endpoint /health.
    Deve restituire 200 OK e {"status": "ok"}.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"db", "status", "date", "version"}
