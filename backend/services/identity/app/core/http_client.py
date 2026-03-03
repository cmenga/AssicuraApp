from typing import Optional
from typing import Dict
from typing import Any
from fastapi.responses import JSONResponse
from app.core.security import create_service_token
from app.core.exceptions import HTTPServiceUnavailable

import httpx


async def call_internal_service(
    url: str,
    method: str = "GET",
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
    circuit_breaker=None,
    correlation_id = str | None
):
    token = create_service_token()
    headers = {"Authorization": f"Bearer {token}", "X-Correlation-ID": correlation_id}

    if circuit_breaker and not circuit_breaker.allow_request():
        raise HTTPServiceUnavailable("Service unavailable (circuit open)")

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.request(
                method=method.upper(),
                url=url,
                headers=headers,
                json=json,
                params=params,
            )

        if response.status_code >= 400:
            try:
                error_detail = response.json()
            except:
                error_detail = response.text
            return JSONResponse(status_code=response.status_code, content=error_detail)

        if circuit_breaker:
            circuit_breaker.record_success()

        return response

    except httpx.RequestError:
        if circuit_breaker:
            circuit_breaker.record_failure()
        raise HTTPServiceUnavailable("Internal service request failed")
