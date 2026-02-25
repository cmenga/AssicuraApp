import uuid
import re

from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator

from typing import Literal

PLATE_REGEX = re.compile(r"^[A-Z]{2}[0-9]{3}[A-Z]{2}$")


class VehicleCreate(BaseModel):
    license_plate: str = Field(max_length=7)
    vin: str = Field(min_length=17, max_length=17)
    type: Literal["auto","moto","autocarro"]
    brand: str = Field(max_length=50)
    model: str = Field(max_length=50)

    @field_validator("license_plate")
    @classmethod
    def validate_plate(cls, value: str) -> str:
        value = value.replace(" ", "").upper()

        if not PLATE_REGEX.match(value):
            raise ValueError("Invalid Italian license plate format")

        return value


class VehicleDetail(BaseModel):
    id: uuid.UUID
    license_plate: str
    vin: str
    brand: str
    model: str
    type: str

    model_config = {"from_attributes": True}


class VehicleUpdate(BaseModel):
    license_plate: str | None = Field(default=None, max_length=7)
    vin: str | None = Field(default=None, min_length=17, max_length=17)
    brand: str | None = Field(default=None, max_length=50)
    model: str | None = Field(default=None, max_length=50)
    type: Literal["auto","moto","autocarro"]

    @field_validator("license_plate")
    @classmethod
    def validate_plate(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.replace(" ", "").upper()

        if not PLATE_REGEX.match(value):
            raise ValueError("Invalid Italian license plate format")

        return value
