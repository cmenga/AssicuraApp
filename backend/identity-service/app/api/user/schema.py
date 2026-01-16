from pydantic import BaseModel
from typing import Literal, List
from datetime import date

class UserDataOut(BaseModel):
    date_of_birth: date
    email: str
    first_name: str
    fiscal_id: str
    gender: Literal["male", "female"]
    last_name: str
    phone_number: str
    place_of_birth: str
    model_config = {"from_attributes": True}


class AddressDataOut(BaseModel):
    cap: int
    city: str
    civic_number: str
    province: str
    street: str
    type: str
    model_config = {"from_attributes": True}


class UserWithAddressOut(BaseModel):
    user: UserDataOut
    address: List[AddressDataOut]
