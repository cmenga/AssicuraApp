from fastapi import APIRouter, status


from api.dependency import db_dependency,auth_dependency,jwt_dependency
from api.utils import get_current_user, get_addresses
from api.user.schema import UserWithAddressOut, UserDataOut, AddressDataOut


user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/me",status_code=status.HTTP_200_OK)
async def get_logged_user(auth_token: auth_dependency, db: db_dependency,jwt: jwt_dependency) -> UserWithAddressOut :
    user = get_current_user(db,jwt.decode_access_token(auth_token)) 
    addresses = get_addresses(db, str(user.id))
    
    normalized_user = UserDataOut.model_validate(user)
    normalized_adresses = list()
    for address in addresses:
        normalized_adresses.append(AddressDataOut.model_validate(address))
    
    return UserWithAddressOut(user=normalized_user, address=normalized_adresses)