import pytest


@pytest.mark.asyncio
async def test_health_endpoint(async_client):
    response = await async_client.get("v1/health")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"service", "version", "environment", "status"}


@pytest.mark.asyncio
async def test_live_endpoint(async_client):
    response = await async_client.get("v1/health/live")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"service", "version", "status"}


@pytest.mark.asyncio(loop_scope="session")
async def test_ready_endpoint(async_client):
    response = await async_client.get("v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {"service", "version", "status", "checks"}
