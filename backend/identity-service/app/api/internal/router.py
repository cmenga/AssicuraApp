from fastapi import APIRouter
from jose import jwt
import hmac


from datetime import datetime, timedelta, timezone
from api.internal.schema import ServiceTokenRequest, ServiceTokenResponse
from api.exceptions import HTTPUnauthorized
from settings import get_secret_key

internal_router = APIRouter(prefix="/internal", include_in_schema=False)


SERVICES: dict = {
    "driver-license-service": "-DZMY0hvzifPyi8Lj_GxBkvuxzxkqY3lf0U5Ckcf-pHpUX61iCjePeSWQTQeUAHtLSqqK9j1gSOc4B0wnlYZUA"
}
JWT_SECRET = get_secret_key()


def create_jwt(payload: dict) -> str:
    payload = payload.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=30)
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@internal_router.post("/service-token", response_model=ServiceTokenResponse)
def issue_service_token(data: ServiceTokenRequest):
    expected = SERVICES.get(data.service_name)
    if not expected or not hmac.compare_digest(expected, data.service_secret):
        raise HTTPUnauthorized("Invalid service credentials")

    token = create_jwt({"sub": data.service_name, "type": "service"})

    return {"access_token": token}
