from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator
from datetime import date, timedelta
import re

from database.models import GenderEnum
from data.province import PROVINCE_OF_ITALY


class UserRegistration(BaseModel):
    email: EmailStr = Field(max_length=150)
    first_name: str = Field(max_length=30, min_length=2)
    last_name: str = Field(max_length=30, min_length=2)

    date_of_birth: date
    place_of_birth: str = Field(max_length=150, min_length=2)
    province_of_birth: str = Field(max_length=150, min_length=2)
    gender: GenderEnum
    fiscal_id: str = Field(max_length=16, min_length=16)

    phone_number: str = Field(max_length=10, min_length=10)

    password: str = Field(max_length=64)
    confirm_password: str = Field(max_length=64)

    accept_privacy_policy: bool
    accept_terms: bool
    subscribe_to_news_letter: bool = Field(default=False)

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "first_name": "Name",
                "last_name": "LastName",
                "date_of_birth": str(date.today() - timedelta(days=365 * 18)),
                "place_of_birth": "Milano",
                "province_of_birth": "Milano",
                "gender": GenderEnum.MALE.__str__(),
                "fiscal_id": "MHGTPP05D123D12T",
                "phone_number": "3330893245",
                "password": "Ciao1234@",
                "confirm_password": "Ciao1234@",
                "accept_privacy_policy": True,
                "accept_terms": True,
                "subscribe_to_news_letter": False,
            }
        }
    }

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()
        if is_valid_name(value):
            raise ValueError(
                "Il nome deve iniziare con una lettera e contenere solo lettere, spazi e apostrofi, senza numeri."
            )
        return value

    @field_validator("date_of_birth")
    @classmethod
    def validate_date_of_birth(cls, value: date):
        under_18 = date.today() - timedelta(days=365 * 18)
        if value > under_18:
            raise ValueError("L'età è inferiore ai 18 anni")
        return value

    @field_validator("place_of_birth")
    @classmethod
    def validate_place_of_birth(cls, value: str):
        value = value.upper()
        for element in PROVINCE_OF_ITALY:
            cities = element["cities"]
            if value in cities:
                return value

        raise ValueError("La città non esiste")

    @field_validator("province_of_birth")
    @classmethod
    def validate_province_of_birth(cls, value: str):
        value = value.upper()
        for element in PROVINCE_OF_ITALY:
            sail = element["sail"]
            name = element["name"]

            if value in [sail, name]:
                return value

        raise ValueError("La proivincia non esiste")

    @field_validator("fiscal_id")
    @classmethod
    def validate_fiscal_id(cls, value: str, info):
        from codicefiscale import codicefiscale

        value = value.upper()

        fiscal_id = codicefiscale.encode(
            lastname=info.data.get("last_name"),
            firstname=info.data.get("first_name"),
            gender=info.data.get("gender").value,
            birthdate=info.data.get("date_of_birth").__str__(),
            birthplace=info.data.get("place_of_birth"),
        )

        if value != fiscal_id:
            raise ValueError("Il codice fiscale non è valido")

        return value

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str):
        if not value.isdigit():
            raise ValueError("Il numero di telefono inserito deve contenere solo numeri")
        return value
    
    @model_validator(mode="after")
    def validate_first(self):
        validate_province_city(
            province=self.province_of_birth, city=self.place_of_birth
        )
        
        if self.password != self.confirm_password:
            raise ValueError("Le password non coincidono")
    
        return self


def is_valid_name(value: str) -> bool:
    """
    The function `is_valid_name` checks if a given string value is a valid name containing only letters,
    spaces, and apostrophes.
    """
    pattern = r"^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s']*$"
    return not re.match(pattern, value)


def validate_province_city(province: str, city: str):
    """
    The function `validate_province_city` checks if a given city and province match in a list of
    provinces and cities in Italy.
    """
    is_place_of_birth: bool = False
    for element in PROVINCE_OF_ITALY:
        sail, name, cities = element["sail"], element["name"], element["cities"]

        if city in cities and province in (sail, name):
            is_place_of_birth = True
            break

    if not is_place_of_birth:
        raise ValueError("Il luogo di nascita non combacia con la provincia")

