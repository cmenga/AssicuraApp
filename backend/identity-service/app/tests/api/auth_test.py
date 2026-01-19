from tests.conftest import app, override_get_db
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

    Args:
        client: The `client` parameter in the `test_signup_success` function is typically an instance of a
            test client that is used to make requests to your API endpoints during testing. This client allows
            you to simulate HTTP requests and test the responses from your API without actually making real
            network requests. It is commonly used
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
    The function `test_signup_user_already_exists` tests signing up a user who already exists.

    Args:
        client: The `client` parameter in the `test_signup_user_already_exists` function is likely an
            instance of a test client that is used to make HTTP requests to the application being tested. In
            this case, it is being used to simulate a POST request to the "/auth/sign-up" endpoint with JSON
            data
    """
    response = client.post(
        "/auth/sign-up",
        json={"user": VALID_USER, "address": VALID_ADDRESS},
    )

    assert response.status_code == status.HTTP_409_CONFLICT


def test_signup_password_mismatch(client):
    """
    The function `test_signup_password_mismatch` tests signing up with mismatched passwords.

    Args:
        client: The `client` parameter in the `test_signup_password_mismatch` function is likely an
            instance of a test client that is used to make HTTP requests to your application during testing. It
            is commonly used in testing frameworks like Flask's test client or Django's test client to simulate
            requests to your API endpoints
    """
    bad_user = VALID_USER.copy()
    bad_user["confirm_password"] = "WrongPassword1!"

    response = client.post(
        "/auth/sign-up",
        json={"user": bad_user, "address": VALID_ADDRESS},
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_sign_in_success(client):
    """
    The function `test_sign_in_success` tests the successful sign-in functionality by sending a POST
    request with email and password, and asserts the expected response status code and content.

    Args:
        client: The `client` parameter in the `test_sign_in_success` function is typically an instance of
            a test client that is used to make HTTP requests to your API endpoints during testing. This client
            is usually provided by the testing framework you are using, such as Flask's test client or Django's
            test client
    """
    response = client.post(
        "/auth/sign-in",
        data={"username": "test@example.com", "password": "Password1!"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert "type" in data and data["type"] == "Bearer"


def test_sign_in_not_success(client):
    """
    The function `test_sign_in_not_success` sends a POST request to the "/auth/sign-in" endpoint with
    specific credentials and asserts that the response status code is 404 Not Found.

    Args:
        client: The `client` parameter in the `test_sign_in_not_success` function is likely an instance of
            a client object that is used for making HTTP requests in a testing environment. It is commonly used
            in testing frameworks like Flask's test client or Django's test client to simulate HTTP requests to
            the application being
    """
    response = client.post(
        "/auth/sign-in",
        data={"username": "test@s.com", "password": "Password1!"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_sign_in_unauthorized(client):
    """
    The function `test_sign_in_unauthorized` sends a POST request to the "/auth/sign-in" endpoint with a
    specific email and password, and asserts that the response status code is 401 (Unauthorized).

    Args:
        client: The `client` parameter in the `test_sign_in_unauthorized` function is likely an instance
            of a test client that is used to make HTTP requests to your application during testing. It is
            commonly used in testing frameworks like Flask's `test_client` or Django's `Client` to simulate
            requests to
    """
    response = client.post(
        "/auth/sign-in",
        data={"username": "test@example.com", "password": "Password1"},
        headers={"Content-type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
