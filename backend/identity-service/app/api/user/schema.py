from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Annotated
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


class ContactDataIn(BaseModel):
    email: EmailStr | None
    phone_number: str | None

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str | None):
        if not value:
            return value
        if not value.isdigit():
            raise ValueError(
                "Il numero di telefono inserito deve contenere solo numeri"
            )
        return value
    
    
