import pytest
import pytest_asyncio

@pytest_asyncio.fixture(scope="function")
async def login_client(async_client, username="test@example.com", password="Password1!"):

    response = await async_client.post(
        "v1/auth/sign-in",
        data={"username": username, "password": password, "remember_me": True},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 204
    assert async_client.cookies["assicurapp_token"] is not None
    assert async_client.cookies["assicurapp_session"] is not None

    return async_client


@pytest.mark.asyncio(loop_scope="session")
async def test_get_me_endpoint(login_client):
    response = await login_client.get("v1/user/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert data["email"] == "test@example.com"

@pytest.mark.asyncio(loop_scope="session")
async def test_logout_endpoint(login_client):

    response = await login_client.post("v1/auth/sign-out")
    assert response.status_code == 200

    assert "assicurapp_token" not in response.cookies
    assert "assicurapp_session" not in response.cookies

@pytest.mark.asyncio(loop_scope="session")
async def test_get_addresses_endpoint(login_client):

    response = await login_client.get("v1/user/addresses")
    assert response.status_code == 200
    addresses = response.json()
    assert isinstance(addresses, list)
    if addresses:
        assert "street" in addresses[0]
        assert "city" in addresses[0]

@pytest.mark.asyncio(loop_scope="session")
async def test_update_contact(login_client):
    payload = {"email": "new_email@test.com", "phone_number": "1234567890"}
    response = await login_client.patch("v1/user/update-contact", json=payload)
    assert response.status_code == 204

    # Verifica che la modifica sia stata effettiva
    response = await login_client.get("v1/user/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new_email@test.com"

    # Revert changes
    payload = {"email": "test@example.com", "phone_number": "3331234567"}
    await login_client.patch("v1/user/update-contact", json=payload)


@pytest.mark.asyncio(loop_scope="session")
async def test_update_address(login_client):
    payload = {
        "street": "Via Nuova",
        "civic_number": "20",
        "city": "MILANO",
        "province": "MI",
        "cap": "20121",
    }
    response = await login_client.put("v1/user/update-address", json=payload)
    assert response.status_code == 204

    response = await login_client.get("v1/user/addresses")
    assert response.status_code == 200
    addresses = response.json()
    assert addresses[0]["street"] == "VIA NUOVA"
    assert addresses[0]["city"] == "MILANO"


@pytest.mark.asyncio(loop_scope="session")
async def test_change_password(login_client):
    payload = {
        "old_password": "Password1!",
        "new_password": "NewPassword1!",
        "confirm_password": "NewPassword1!",
    }
    response = await login_client.patch("v1/user/change-password", json=payload)
    assert response.status_code == 204

    # Revert password
    payload = {
        "old_password": "NewPassword1!",
        "new_password": "Password1!",
        "confirm_password": "Password1!",
    }
    await login_client.patch("v1/user/change-password", json=payload)


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user(login_client):
    response = await login_client.delete("v1/user/delete")
    assert response.status_code == 204

    assert response.cookies.get("assicurapp_token") == None
    assert response.cookies.get("assicurapp_session") == None
