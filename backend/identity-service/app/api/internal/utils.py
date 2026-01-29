from typing import Optional, Dict, Any
from security import create_service_token
import httpx

async def call_internal_service(
    url: str,
    method: str = "GET",
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
) -> Dict[str, Any]:
    token = create_service_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.request(
            method=method.upper(), url=url, headers=headers, json=json, params=params
        )
        response.raise_for_status()
        return response.json()
