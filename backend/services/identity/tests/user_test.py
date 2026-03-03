import pytest


async def login_client(async_client, username="test@example.com", password="Password1!"):

    response = await async_client.post(
        "v1/auth/sign-in",
        data={"username": username, "password": password, "remember_me": True},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 204

    return async_client


@pytest.mark.asyncio(loop_scope="session")
async def test_logout_endpoint(async_client):
    await login_client(async_client)
    
    response = await async_client.post("v1/auth/sign-out")
    assert response.status_code == 200
    
    assert "assicurapp_token" not in response.cookies
    assert "assicurapp_session" not in response.cookies


# def test_get_me(client):
#     headers = get_auth_headers(client)
#     response = client.get("/user/me", headers=headers)
#     assert response.status_code == 200
#     data = response.json()
#     assert "email" in data
#     assert data["email"] == "test@example.com"


# def test_get_addresses(client):
#     headers = get_auth_headers(client)
#     response = client.get("/user/addresses", headers=headers)
#     assert response.status_code == 200
#     addresses = response.json()
#     assert isinstance(addresses, list)
#     if addresses:
#         assert "street" in addresses[0]
#         assert "city" in addresses[0]


# def test_update_contact(client):
#     headers = get_auth_headers(client)
#     payload = {"email": "new_email@test.com", "phone_number": "1234567890"}

#     response = client.patch("/user/update-contact", json=payload, headers=headers)
#     assert response.status_code == 200

#     # Verifica che la modifica sia stata effettiva
#     response = client.get("/user/me", headers=headers)
#     assert response.status_code == 401
    
#     headers = get_auth_headers(client,username="new_email@test.com")
#     response = client.get("/user/me", headers=headers)
#     data = response.json()
#     assert data["email"] == "new_email@test.com"
