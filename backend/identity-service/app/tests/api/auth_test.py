from tests.conftest import app,override_get_db
from database.session import get_db 
from fastapi import status
from scripts.run_all import run_all

run_all()
app.dependency_overrides[get_db] = override_get_db

VALID_USER = {
    "email": "test@example.com",
    "first_name": "Mario",
    "last_name": "Rossi",
    "date_of_birth": "1990-01-01",
    "place_of_birth": "Milano",
    "province_of_birth": "Milano",
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


def test_signup_success(client):    
    """
    The function `test_signup_success` sends a POST request to the "/auth/sign-up" endpoint with valid
    user and address data and asserts that the response status code is 204.
    """
    response = client.post(
        "/auth/sign-up",
        json={
            "user": VALID_USER,
            "address": VALID_ADDRESS,
        },
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_signup_user_already_exists(client):
    """
    The function tests signing up a user who already exists in the system.
    """
    response = client.post(
        "/auth/sign-up",
        json={"user": VALID_USER, "address": VALID_ADDRESS},
    )

    assert response.status_code == status.HTTP_409_CONFLICT



def test_signup_password_mismatch(client):
    """
    The function `test_signup_password_mismatch` tests signing up with mismatched passwords.
    """
    bad_user = VALID_USER.copy()
    bad_user["confirm_password"] = "WrongPassword1!"

    response = client.post(
        "/auth/sign-up",
        json={"user": bad_user, "address": VALID_ADDRESS},
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
