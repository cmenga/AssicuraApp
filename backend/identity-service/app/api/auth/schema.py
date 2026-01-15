from pydantic import (
    BaseModel,
    Field,
    EmailStr,
    field_validator,
    model_validator,
    AfterValidator,
)
from datetime import date, timedelta
from typing import Literal, Annotated
import re

from data.cities import ITALY_CITIES


def strip_string_value(value: str):
    array = value.split(" ")
    array = list(filter(lambda x: x != " ", array))

    return " ".join(array)


upper_value = lambda value: value.upper()
strip_value = lambda value: strip_string_value(value)


class UserRegistration(BaseModel):
    email: EmailStr = Field(max_length=150)
    first_name: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]
    last_name: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]

    date_of_birth: date
    place_of_birth: Annotated[
        str, AfterValidator(upper_value), AfterValidator(strip_value)
    ] = Field(max_length=150, min_length=2)
    gender: Literal["male", "female"]
    fiscal_id: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]

    phone_number: str

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
                "gender": "male",
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
        pattern = r"^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s']*$"
        if not re.match(pattern, value):
            raise ValueError(
                "Deve iniziare con una lettera e contenere solo lettere, spazi e apostrofi, senza numeri."
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
        value = validate_city(value)
        return value.upper()

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str):
        if not value.isdigit():
            raise ValueError(
                "Il numero di telefono inserito deve contenere solo numeri"
            )
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        from password_validator import PasswordValidator

        schema = PasswordValidator()
        schema.min(8).max(
            64
        ).has().uppercase().has().lowercase().has().digits().has().no().spaces()

        if not schema.validate(value):
            raise ValueError("La password non è valida")
        if not re.search(r"[^a-zA-Z0-9]", value):
            raise ValueError("La password non è valida")

        return value

    @model_validator(mode="after")
    def validate_first(self):
        validate_fiscal_id(
            self.fiscal_id,
            last_name=self.last_name,
            firstname=self.first_name,
            gender="M" if self.gender == "male" else "F",
            birthdate=self.date_of_birth.__str__(),
            birthplace=self.place_of_birth,
        )
        if self.password != self.confirm_password:
            raise ValueError("Le password non coincidono")

        return self


def validate_fiscal_id(
    value: str,
    last_name: str,
    firstname: str,
    gender: Literal["M", "F"],
    birthdate: str,
    birthplace: str,
):
    from codicefiscale import codicefiscale

    fiscal_id = codicefiscale.encode(
        lastname=last_name,
        firstname=firstname,
        gender=gender,
        birthdate=birthdate,
        birthplace=birthplace,
    )

    if value != fiscal_id:
        raise ValueError(
            "Il codice fiscale non è valido, verifica anche tutte le informazioni come nome,cogome, data di nascita e luogo di nascita."
        )


class AddressRegistration(BaseModel):
    street: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]
    civic_number: str = Field(max_length=8)
    city: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]
    province: Annotated[str, AfterValidator(upper_value), AfterValidator(strip_value)]
    cap: str
    type: Literal["domicile", "residence"]

    model_config = {
        "json_schema_extra": {
            "example": {
                "street": "Via Montenapoleone",
                "civic_number": "172",
                "city": "Milano",
                "province": "ML",
                "cap": "20121",
                "type": "residence"
            }
        }
    }
     
    @field_validator("street")
    @classmethod
    def validate_street(cls, value: str):
        pattern = r"^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\.'\-\/]+$"
        if not re.match(pattern, value):
            raise ValueError("La via contiene caratteri sbagliati")
        return value

    @field_validator("civic_number")
    @classmethod
    def validate_civic_number(cls, value: str):
        pattern = r"^[0-9]+[A-Z]?([/-][0-9A-Z]+)?$"
        if not re.match(pattern, value):
            raise ValueError("Il civico non è valido")

        return value

    @field_validator("province")
    @classmethod
    def validate_province(cls, value: str):
        validate_province(value)
        return value

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: str):
        validate_city(value)
        return value

    @field_validator("cap")
    @classmethod
    def validate_cap(cls, value: str):
        if len(value) != 5:
            raise ValueError("Il cap  italaino è formato da 5 numeri")
        if not value.isdigit():
            raise ValueError("Il cap non risulta valido")
        return value

    @model_validator(mode="after")
    def validate_model(self):
        validate_province_city(self.province, self.city)
        validate_cap(city=self.city, province=self.province, cap=self.cap)
        return self


def validate_province_city(province: str, city: str):
    """
    The function `validate_province_city` checks if a given city and province match in a list of
    provinces and cities in Italy.
    """
    is_place_of_birth: bool = False
    for element in ITALY_CITIES:
        _sail, _name, _province = element["sail"], element["name"], element["province"]
        if city in _name and (province == _sail or province == _province):
            is_place_of_birth = True
            break

    if not is_place_of_birth:
        raise ValueError("La città non combacia con la provincia inserita")


def validate_province(province: str):
    """
    The function `validate_province` checks if a given province name is valid in Italy.
    """
    for element in ITALY_CITIES:
        if province == element["sail"] or province == element["province"]:
            return province

    raise ValueError("La proivincia non esiste")


def validate_city(city: str):
    """
    The function `validate_city` checks if a given city is in the list of cities in the provinces of
    Italy and returns the city if found, otherwise raises a ValueError.
    """
    for element in ITALY_CITIES:
        if city == element["name"]:
            return city

    raise ValueError("La città non esiste")


def validate_cap(city: str, cap: str, province: str):
    """
    The function `validate_cap` checks if a given city, postal code (CAP), and province combination is
    valid in Italy.
    """
    is_valid_cap = False

    for element in ITALY_CITIES:
        values = {
            "sail": element["sail"],
            "province": element["province"],
            "name": element["name"],
            "cap": element["cap"],
        }
        is_province = province == values["sail"] or province == values["province"]
        if city == values["name"] and is_province and cap in values["cap"]:
            is_valid_cap = True
            break

    if not is_valid_cap:
        raise ValueError("Il cap inserito non è corretto")
