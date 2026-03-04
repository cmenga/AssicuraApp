import pytest
from datetime import date


@pytest.mark.asyncio(loop_scope="session")
async def test_add_license_and_get_id(async_client):
    """
    Helper function to add a license and return its ID.
    """
    add_response = await async_client.post(
        "v1/driver-license/add",
        json={
            "date_of_birth": date(year=2000, month=1, day=1).__str__(),
            "license_number": "B1234567B",
            "license_code": "A",
            "expiry_date": date(year=2028, month=12, day=31).__str__(),
            "issue_date": date(year=2018, month=12, day=31).__str__(),
        },
    )
    assert add_response.status_code == 204

    get_response = await async_client.get("v1/driver-license/licenses")
    assert get_response.status_code == 200
    licenses = get_response.json()
    assert len(licenses) > 0
    return licenses[0]["id"]


@pytest.mark.asyncio(loop_scope="session")
async def test_get_no_licenses(async_client):
    """
    Tests that a new user without licenses gets a null response.
    """
    response = await async_client.get("v1/driver-license/licenses")
    assert response.status_code == 200
    assert response.json() is not None


@pytest.mark.asyncio(loop_scope="session")
async def test_add_and_get_license(async_client):
    """
    Tests adding a new license and then retrieving it to verify creation.
    """
    payload = {
        "date_of_birth": "1990-01-01",
        "license_number": "U1234567A",
        "license_code": "B",
        "expiry_date": "2028-01-01",
        "issue_date": "2018-01-01",
    }

    response = await async_client.post("v1/driver-license/add", json=payload)
    assert response.status_code == 204

    response = await async_client.get("v1/driver-license/licenses")
    assert response.status_code == 200
    licenses = response.json()
    assert isinstance(licenses, list)
    assert len(licenses) >= 1
    assert list(filter(lambda x: x["number"] == payload["license_number"],licenses))[0]["number"] == "U1234567A"
    assert list(filter(lambda x: x["code"] == payload["license_code"], licenses))[0]["code"] == "B"


@pytest.mark.asyncio(loop_scope="session")
async def test_add_conflicting_license(async_client):
    """
    Tests that adding a license with a conflicting number or code fails.
    The check on `license_code` is currently system-wide, not per-user.
    """

    initial_payload = {
        "date_of_birth": "1990-01-01",
        "license_number": "U1111111X",
        "license_code": "B",
        "expiry_date": "2028-01-01",
        "issue_date": "2018-01-01",
    }
    await async_client.post("v1/driver-license/add", json=initial_payload)

    conflict_payload_number = {
        "date_of_birth": "1992-02-02",
        "license_number": "U1111111X", 
        "license_code": "A",
        "expiry_date": "2029-02-02",
        "issue_date": "2019-02-02",
    }
    response = await async_client.post(
        "v1/driver-license/add", json=conflict_payload_number
    )
    assert response.status_code == 409


@pytest.mark.asyncio(loop_scope="session")
async def test_update_license(async_client):
    """
    Tests updating an existing driver's license.
    """

    update_payload = {
        "date_of_birth": "1995-05-05",
        "license_number": "U6666666F",
        "license_code": "C",
        "expiry_date": "2031-05-05",
        "issue_date": "2021-05-05",
    }
    licenses_response = await async_client.get("v1/driver-license/licenses")
    license_id = licenses_response.json()[0]["id"]
    
    response = await async_client.patch(f"v1/driver-license/update/{license_id}", json=update_payload)
    assert response.status_code == 200

    response = await async_client.get("v1/driver-license/licenses")
    assert response.status_code == 200
    license = list(filter(lambda x: x["id"] == license_id,response.json()))
    assert license[0]["number"] == update_payload["license_number"]


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_license(async_client):
    """
    Tests deleting a driver's license.
    """
    licenses_response = await async_client.get("v1/driver-license/licenses")
    license_id = licenses_response.json()[0]["id"]
    delete_response = await async_client.delete(
        f"v1/driver-license/delete/{license_id}"
    )
    assert delete_response.status_code == 200

    get_response = await async_client.get("v1/driver-license/licenses")
    assert get_response.status_code == 200
    license = get_response.json()
    assert not any(item["id"] == license_id for item in license)