import pytest
from fastapi import status


VALID_USER = {
    "email": "test@example.com",
    "first_name": "Mario",
    "last_name": "Rossi",
    "date_of_birth": "1990-01-01",
    "place_of_birth": "Milano",
    "gender": "male",
    "phone_number": "3331234567",
    "password": "Password1!",
    "confirm_password": "Password1!",
    "accept_privacy_policy": True,
    "accept_terms": True,
    "subscribe_to_news_letter": False,
    "fiscal_id": "RSSMRA90A01F205Z",
}

VALID_ADDRESS = {
    "street": "Via Roma",
    "civic_number": "10",
    "city": "MILANO",
    "province": "MI",
    "cap": "20121",
    "type": "residence",
}

VALID_LICENSE = {
    "date_of_birth": "1990-01-01",
    "license_number": "B1234567B",
    "license_code": "A",
    "expiry_date": "2018-01-01",
    "issue_date": "2028-01-01",
}


import json

@pytest.mark.asyncio(loop_scope="session")
async def test_signup_success(async_client):    

    response = await async_client.post(
        "v1/auth/sign-up",
        json={
            "user": VALID_USER,
            "address": VALID_ADDRESS,
            "license": VALID_LICENSE
        },
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.asyncio(loop_scope="session")
async def test_signup_user_already_exists(async_client):
    response = await async_client.post(
        "v1/auth/sign-up",
        json={"user": VALID_USER, "address": VALID_ADDRESS, "license": VALID_LICENSE},
    )

    assert response.status_code == status.HTTP_409_CONFLICT


@pytest.mark.asyncio(loop_scope="session")
async def test_signup_password_mismatch(async_client):
    """
    The function `test_signup_password_mismatch` tests signing up with mismatched passwords.
    """
    bad_user = VALID_USER.copy()
    bad_user["confirm_password"] = "WrongPassword1!"

    response = await async_client.post(
        "v1/auth/sign-up",
        json={"user": bad_user, "address": VALID_ADDRESS, "license": VALID_LICENSE},
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio(loop_scope="session")
async def test_sign_in_success(async_client):
    response = await async_client.post(
        "v1/auth/sign-in",
        data={"username": "test@example.com", "password": "Password1!"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    data = response.cookies
    assert "assicurapp_token" in data


@pytest.mark.asyncio(loop_scope="session")
async def test_sign_in_not_success(async_client):
    response = await async_client.post(
        "v1/auth/sign-in",
        data={"username": "test@s.com", "password": "Password1!"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio(loop_scope="session")
async def test_sign_in_unauthorized(async_client):
    response = await async_client.post(
        "v1/auth/sign-in",
        data={"username": "test@example.com", "password": "Password1"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
