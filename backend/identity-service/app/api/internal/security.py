from fastapi import Request, Depends
from settings import get_service_secret, get_service_name, get_algorithm
from datetime import datetime, timedelta, timezone
from jose import jwt, ExpiredSignatureError, JWTError
from typing import Dict
from api.exceptions import HTTPForbidden, HTTPUnauthorized

SERVICE_SECRET = get_service_secret()
SERVICE_NAME = get_service_name()
ALGHORITHM = get_algorithm()

SERVICES: Dict[str, str] = {"service-name": "service-secret"}


def create_service_token():
    expire: float = (datetime.now(timezone.utc) + timedelta(minutes=15)).timestamp()
    claims: Dict[str, str | int] = {
        "sub": SERVICE_NAME,
        "type": "service",
        "exp": int(expire),
    }
    return jwt.encode(claims, key=SERVICE_SECRET, algorithm=ALGHORITHM)


def get_token(request: Request):
    auth_request = request.headers.get("Authorization")
    if not auth_request or not auth_request.startswith("Bearer"):
        raise HTTPForbidden("Missing token")

    token = auth_request.split(" ")[1]
    return token


def decode_jwt(token: str = Depends(get_token)):
    unverified_payload = jwt.get_unverified_claims(token)
    sub = unverified_payload["sub"]
    _type = unverified_payload["type"]
    if sub not in SERVICES and _type != "service":
        raise HTTPForbidden("Not authorized")
    try:
        payload = jwt.decode(token, key=SERVICES[sub], algorithms=ALGHORITHM)
        return payload
    except ExpiredSignatureError:
        raise HTTPUnauthorized("Token expired")
    except JWTError:
        raise HTTPUnauthorized("Invalid token")
