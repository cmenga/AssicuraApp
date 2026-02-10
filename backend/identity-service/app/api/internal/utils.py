from fastapi.responses import JSONResponse 
from typing import Optional, Dict, Any
from api.internal.security import create_service_token
import httpx


async def call_internal_service(
    url: str,
    method: str = "GET",
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
):
    token = create_service_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient(timeout=timeout) as client:
        
        response = await client.request(
            method=method.upper(),
            url=url,
            headers=headers,
            json=json,
            params=params,
        )

        if response.status_code >= 422:    
            try:
                error_detail = response.json()
            except ValueError:
                error_detail = {"message":response.text, "errors": []}

            return JSONResponse(status_code=response.status_code, content=error_detail)

        return response
    
