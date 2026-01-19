from tests.conftest import app,override_get_db, TestingSessionLocal
from database.session import get_db 
from scripts.run_all import run_all

run_all()
app.dependency_overrides[get_db] = override_get_db

def get_auth_headers(client, username="test@example.com", password="Password1!"):
    """Log in e ritorna headers Authorization"""
    response = client.post(
        "/auth/sign-in",
        data={"username": username, "password": password},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    data = response.json()
    return {"Authorization": f"{data['type']} {data['access_token']}"}


def test_get_me(client):
    headers = get_auth_headers(client)
    response = client.get("/user/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert data["email"] == "test@example.com"


def test_get_addresses(client):
    headers = get_auth_headers(client)
    response = client.get("/user/addresses", headers=headers)
    assert response.status_code == 200
    addresses = response.json()
    assert isinstance(addresses, list)
    if addresses:
        assert "street" in addresses[0]
        assert "city" in addresses[0]


def test_update_contact(client):
    headers = get_auth_headers(client)
    payload = {"email": "new_email@test.com", "phone_number": "1234567890"}

    response = client.patch("/user/update-contact", json=payload, headers=headers)
    assert response.status_code == 200

    # Verifica che la modifica sia stata effettiva
    response = client.get("/user/me", headers=headers)
    assert response.status_code == 401
    
    headers = get_auth_headers(client,username="new_email@test.com")
    response = client.get("/user/me", headers=headers)
    data = response.json()
    assert data["email"] == "new_email@test.com"