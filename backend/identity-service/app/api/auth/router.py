from fastapi import APIRouter, Form
from typing import Annotated

from api.dependency import db_dependency
from api.auth.schema import UserRegistration 
from database.models import User


auth_router = APIRouter(tags=["auth"], prefix="/auth")


@auth_router.post("/sign-up")
async def create_new_account(db: db_dependency, item: Annotated[UserRegistration, Form()]) -> UserRegistration:
    return item