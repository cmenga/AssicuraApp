from fastapi import APIRouter, status


from api.dependency import db_dependency,auth_dependency,jwt_dependency
from api.utils import get_current_user, get_addresses
from api.user.schema import UserWithAddressOut, UserDataOut, AddressDataOut


user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/me",status_code=status.HTTP_200_OK)
async def get_logged_user(auth_token: auth_dependency, db: db_dependency,jwt: jwt_dependency) -> UserDataOut :
    user = get_current_user(db,jwt.decode_access_token(auth_token)) 
    return UserDataOut.model_validate(user)

    
  