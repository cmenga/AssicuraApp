import httpx
from typing import Optional, Dict, Any
from fastapi import Depends, Cookie
from fastapi.responses import JSONResponse


from core.security import create_service_token, IJwtService, get_jwt_access_token
from core.exceptions import HTTPUnauthorized

async def call_internal_service(
    url: str,
    method: str = "GET",
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
):
    """
    Asynchronously call an internal service with the provided URL, method, JSON data, parameters, and timeout.
    @param url - The URL of the internal service.
    @param method - The HTTP method to use (default is "GET").
    @param json - JSON data to send in the request (default is None).
    @param params - Parameters to include in the request (default is None).
    @param timeout - Timeout value for the request in seconds (default is 10).
    @return The response from the internal service.
    """
    token = create_service_token()
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.request(
            method=method.upper(), url=url, headers=headers, json=json, params=params
        )
        if response.status_code >= 400:
            try:
                error_detail = response.json()
            except:
                error_detail = response.text
            return JSONResponse(status_code=response.status_code, content=error_detail)

        return response


async def get_access_token(
    jwt: IJwtService = Depends(get_jwt_access_token),
    assicurapp_token: str | None = Cookie(None),
):
    payload = None

    if assicurapp_token is None:
        raise HTTPUnauthorized("not authorized")

    try:
        payload = jwt.decode(assicurapp_token)
        return payload
    except HTTPUnauthorized:
        response = await call_internal_service(
            url="http://identity-service:8001/internal/refresh",
            method="POST",
            json={"access_token": assicurapp_token},
        )
        if isinstance(response, JSONResponse):
            raise HTTPUnauthorized("not authorized")

        result = response.json()
        if "access_token" not in result:
            raise HTTPUnauthorized("not authorized")

        payload = jwt.decode(result["access_token"])
        return payload

    finally:
        if payload is None:
            raise HTTPUnauthorized("not authorized")
