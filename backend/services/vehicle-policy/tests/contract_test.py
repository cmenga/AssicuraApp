import pytest
import pytest_asyncio
import uuid
import random
import string
from datetime import date, timedelta


@pytest_asyncio.fixture(scope="session")
async def create_vehicle(async_client):
    payload = {
        "type": "auto",
        "license_plate": "AA111AA",
        "vin": "".join(random.choices(string.ascii_uppercase + string.digits, k=17)),
        "brand": "Fiat",
        "model": "Panda",
    }
    response = await async_client.post("/v1/vehicle/add", json=payload)
    assert response.status_code == 204


@pytest.mark.asyncio(loop_scope="session")
async def test_create_and_get_single_contract(async_client, create_vehicle):
    """
    Tests creating a new contract and then fetching it by its ID.
    """
    # 1. Get the vehicle created by the fixture to retrieve its ID and type
    get_vehicles_res = await async_client.get("/v1/vehicle/vehicles")
    assert get_vehicles_res.status_code == 200
    vehicles = get_vehicles_res.json()

    test_vehicle = next((v for v in vehicles if v["license_plate"] == "AA111AA"), None)
    assert test_vehicle is not None, "Vehicle with license plate AA111AA not found"

    vehicle_id = test_vehicle["id"]
    vehicle_type = test_vehicle["type"]

    # 2. Get available policies for the vehicle's type
    get_policies_res = await async_client.get(f"/v1/insurance/policies/{vehicle_type}")
    assert get_policies_res.status_code == 200
    policies = get_policies_res.json()
    assert len(policies) > 1, "Not enough policies available to run the test"

    # Select 'RCA Base' and 'Furto e Incendio' policies for the test
    rca_policy = next((p for p in policies if "RCA Base" in p["name"]), None)
    fi_policy = next((p for p in policies if "Furto e Incendio" in p["name"]), None)

    assert rca_policy is not None, "RCA Base policy not found for this vehicle type"
    assert (
        fi_policy is not None
    ), "Furto e Incendio policy not found for this vehicle type"

    selected_policy_ids = [rca_policy["id"], fi_policy["id"]]
    insurance_ids_query = ",".join(map(str, selected_policy_ids))

    # 3. Create the contract
    params = {"insurance_ids": insurance_ids_query, "vehicle_id": vehicle_id}
    create_contract_res = await async_client.post(
        f"/v1/contract/add/{vehicle_type}", params=params
    )
    assert (
        create_contract_res.status_code == 204
    ), f"Failed to create contract: {create_contract_res.text}"

    # 4. Get all contracts to find the ID of the newly created one
    get_contracts_res = await async_client.get("/v1/contract/all")
    assert get_contracts_res.status_code == 200
    contracts = get_contracts_res.json()

    new_contract = next((c for c in contracts if c["vehicle_id"] == vehicle_id), None)
    assert (
        new_contract is not None
    ), "Newly created contract not found in user's contracts list"
    contract_id = new_contract["id"]

    # 5. Fetch the policies associated with the new contract to verify them
    get_contract_policies_res = await async_client.get(
        f"/v1/contract/policies/{contract_id}"
    )
    assert get_contract_policies_res.status_code == 200
    contract_policies = get_contract_policies_res.json()

    # 6. Verify the policies match what was selected
    assert len(contract_policies) == len(selected_policy_ids)
    returned_policy_ids = {p["id"] for p in contract_policies}
    assert returned_policy_ids == set(selected_policy_ids)


@pytest.mark.asyncio(loop_scope="session")
async def test_get_all_contracts(async_client):
    """
    Tests retrieving all contracts for the authenticated user.
    It relies on test_create_and_get_single_contract to have run first
    and created a contract.
    """
    response = await async_client.get("/v1/contract/all")
    assert response.status_code == 200
    contracts = response.json()
    assert isinstance(contracts, list)
    assert len(contracts) > 0
    # Check the structure of the first contract
    assert "id" in contracts[0]
    assert "vehicle_id" in contracts[0]
    assert "total_price" in contracts[0]
    assert "is_active" in contracts[0]


