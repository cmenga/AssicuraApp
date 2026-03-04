import pytest


@pytest.mark.asyncio(loop_scope="session")
async def test_get_policies_by_vehicle_type(async_client):
    """
    Tests retrieving policies for each vehicle type (auto, moto, autocarro).
    """
    vehicle_types = ["auto", "moto", "autocarro"]

    for v_type in vehicle_types:
        response = await async_client.get(f"/v1/insurance/policies/{v_type}")
        assert response.status_code == 200
        policies = response.json()
        assert isinstance(policies, list)
        assert len(policies) > 0
        for policy in policies:
            assert policy["vehicle_type"] == v_type
            assert "name" in policy

            assert "price" in policy
