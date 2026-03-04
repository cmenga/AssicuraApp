import pytest
import random
import string

def random_string(length=10):
    """Generates a random string of fixed length."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@pytest.mark.asyncio(loop_scope="session")
async def test_create_vehicle(async_client):
    """
    Tests creating a new vehicle.
    """
    payload = {
        "type": "auto",
        "license_plate": "BB111BB",
        "vin": random_string(17),
        "brand": "Fiat",
        "model": "Panda"
    }
    response = await async_client.post("/v1/vehicle/add", json=payload) 
    assert response.status_code == 204


@pytest.mark.asyncio(loop_scope="session")
async def test_get_all_vehicles(async_client):
    """
    Tests retrieving all vehicles for the authenticated user.
    """
    # Ensure we have at least one vehicle created

    response = await async_client.get("/v1/vehicle/vehicles")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Verify structure of the first item
    assert "id" in data[0]
    assert "license_plate" in data[0]

@pytest.mark.asyncio(loop_scope="session")
async def test_update_vehicle(async_client):
    """
    Tests updating an existing vehicle.
    """
    # Create a vehicle first
    payload = {
        "type": "autocarro",
        "license_plate": "BB222BB",
        "vin": random_string(17),
        "brand": "Iveco",
        "model": "Daily"
    }
    create_response = await async_client.post("/v1/vehicle/add", json=payload)
    assert create_response.status_code == 204

    get_response = await async_client.get("/v1/vehicle/vehicles")
    assert get_response.status_code == 200
    data = get_response.json()
    vehicle = list(filter(lambda x: x["license_plate"] == payload["license_plate"], data))[0]
    
    update_payload = {
        "type": vehicle["type"],
        "brand": "Iveco Updated"
    }
    
    response = await async_client.patch(f"/v1/vehicle/update/{vehicle["id"]}", json=update_payload)
    assert response.status_code == 204

    # Verify update by fetching the list
    list_res = await async_client.get("/v1/vehicle/vehicles")
    vehicles = list_res.json()
    updated_vehicle = next((v for v in vehicles if v["id"] == vehicle["id"]), None)
    assert updated_vehicle is not None
    assert updated_vehicle["brand"] == "Iveco Updated"

@pytest.mark.asyncio(loop_scope="session")
async def test_delete_vehicle(async_client):
    """
    Tests deleting a vehicle.
    """
    # Create a vehicle first
    payload = {
        "type": "auto",
        "license_plate": "BB333BB",
        "vin": random_string(17),
        "brand": "Ford",
        "model": "Fiesta"
    }
    create_res = await async_client.post("/v1/vehicle/add", json=payload)
    assert create_res.status_code == 204

    get_response = await async_client.get("/v1/vehicle/vehicles")
    assert get_response.status_code == 200
    data = get_response.json()
    vehicle = list(filter(lambda x: x["license_plate"] == payload["license_plate"], data))[0]

    # Delete the vehicle
    response = await async_client.delete(f"/v1/vehicle/delete/{vehicle["id"]}")
    assert response.status_code in [200, 204]

    # Verify deletion
    list_res = await async_client.get("/v1/vehicle/vehicles")
    vehicles = list_res.json()
    assert not any(v["id"] == vehicle["id"] for v in vehicles)
