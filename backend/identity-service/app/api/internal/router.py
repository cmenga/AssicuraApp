from fastapi import APIRouter
import httpx
from typing import Optional, Dict,Any
from api.internal.security import create_service_token

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


internal_router = APIRouter(prefix="/internal", include_in_schema=False)
