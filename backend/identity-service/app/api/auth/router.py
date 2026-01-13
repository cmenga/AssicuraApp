from fastapi import APIRouter, Body
from typing import Annotated

from api.dependency import db_dependency
from api.auth.schema import UserRegistration,AddressRegistration 
from database.models import User


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up")
async def create_new_account(db: db_dependency,address: Annotated[AddressRegistration, Body()] ) -> AddressRegistration:
    return address