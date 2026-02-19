from fastapi import APIRouter
from fastapi import status
from fastapi import Request
from fastapi import Depends 
from fastapi import Body
from jose import jwt

from core.dependencies import DbSession
from core.dependencies import JWTAccessToken
from core.security import decode_jwt
from core.exceptions import HTTPForbidden, HTTPUnauthorized


from database.models import Token

router = APIRouter(prefix="/internal", include_in_schema=False)


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def get_access_token(
    request: Request,
    db: DbSession,
    jwt_access: JWTAccessToken,
    _=Depends(decode_jwt),
    access_token: str = Body(embed=True),
):
    """
    This Python function handles refreshing access tokens for authenticated users.

    Args:
      request (Request): The `request` parameter in the code snippet represents the incoming request
    made to the `/refresh` endpoint. It allows you to access information about the request, such as
    headers, cookies, and query parameters. You can use it to extract data from the request or to modify
    the response that will be sent
      db (DbSession): The `db` parameter in the code snippet refers to a database session object that is
    used to interact with the database. It is likely an instance of a database session class that allows
    you to query and manipulate data in the database. In this case, it is being used to query the
    database for a
      jwt_access (JWTAccessToken): The `jwt_access` parameter in the code snippet is an instance of a
    class or object that is used to encode and decode JSON Web Tokens (JWTs) for access tokens. It is
    likely a utility or helper class that provides methods for generating and validating JWTs used for
    authentication and authorization purposes in
      _: The underscore (_) in the function signature `_=Depends(decode_jwt)` is used to ignore the
    return value of the `Depends` function. In FastAPI, when using dependencies with `Depends`, you can
    assign the return value of the dependency to a variable. In this case, the
      access_token (str): The `access_token` parameter in the code snippet represents the access token
    that is passed in the request body. This access token is used to authenticate and authorize the user
    making the request. The code decodes the access token to extract the payload and then checks if the
    "sub" key is present in

    Returns:
      The code is returning a new access token in the response body with the key "access_token"
    containing the newly generated access token value.
    """
    payload = jwt.get_unverified_claims(access_token)

    if "sub" not in payload:
        raise HTTPForbidden("Missing user token")
    sub = payload["sub"]

    request.state.logger.info("Internal request", type=payload["type"], service=payload["sub"])
    fetched_token = db.query(Token).filter(Token.user_id == sub).first()
    if not fetched_token:
        raise HTTPUnauthorized("Not authorized")

    new_access_token = jwt_access.encode(sub, minutes=1)
    return {"access_token": new_access_token}
