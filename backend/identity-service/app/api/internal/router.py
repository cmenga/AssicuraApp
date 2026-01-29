from fastapi import APIRouter, status, Depends, Body
from jose import jwt


from api.internal.security import decode_jwt
from api.exceptions import HTTPForbidden, HTTPUnauthorized
from api.dependency import DbSession, JWTAccessService
from database.models import Token

internal_router = APIRouter(prefix="/internal", include_in_schema=False)

@internal_router.post("/refresh",status_code=status.HTTP_200_OK)
async def get_access_token(db: DbSession,jwt_access: JWTAccessService, _ = Depends(decode_jwt), access_token: str = Body() ):
    payload = jwt.get_unverified_claims(access_token)

    if "sub" not in payload:
        raise HTTPForbidden("Missing user token")
    sub = payload["sub"]

    fetched_token = db.query(Token).filter(Token.user_id == sub).first()
    if not fetched_token:
        raise HTTPUnauthorized("Not authorized")

    new_access_token = jwt_access.encode(sub,minutes=1)
    return {"access_token": new_access_token}
