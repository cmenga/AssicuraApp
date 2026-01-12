from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import date
import re

from database.models import GenderEnum

class __StandardTemplate(BaseModel):
    pass

class UserRegistration(BaseModel):
    email: EmailStr
    first_name: str = Field(max_length=30, min_length=2)
    last_name: str = Field(max_length=30, min_length=2)
    fiscal_id: str = Field(max_length=16, min_length=16)
    date_of_birth: date
    place_of_birth: str = Field(max_length=150, min_length=2)
    gender: GenderEnum

    email: str = Field(max_length=150)
    phone_number: str = Field(max_length=10, min_length=10)

    password: str = Field(max_length=64)
    confirm_password: str = Field(max_length=64)

    accept_privacy_policy: bool
    accept_terms: bool
    subscribe_to_news_letter: bool

    model_config={}
    
    @field_validator("first_name","last_name")
    @classmethod
    def validate_first_name(cls, value: str):
        value = value.strip()
        if is_valid_name:
            raise ValueError(
                "Il nome deve iniziare con una lettera e contenere solo lettere, spazi e apostrofi, senza numeri."
            )
        return value



def is_valid_name(value: str) -> bool:
    pattern = r"^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s']*$"
    return not re.match(pattern, value)
