import uuid
import re
from pydantic import BaseModel, Field, field_validator, ConfigDict


PLATE_REGEX = re.compile(r"^[A-Z]{2}[0-9]{3}[A-Z]{2}$")


class VehicleCreate(BaseModel):
    license_plate: str = Field(max_length=7)
    vin: str = Field(min_length=17, max_length=17)
    brand: str = Field(max_length=50)
    model: str = Field(max_length=50)
    user_id: uuid.UUID

    @field_validator("license_plate")
    @classmethod
    def validate_plate(cls, value: str) -> str:
        value = value.replace(" ", "").upper()

        if not PLATE_REGEX.match(value):
            raise ValueError("Invalid Italian license plate format")

        return value


class VehicleDetail(BaseModel):
    license_plate: str
    vin: str
    brand: str
    model: str
    user_id: uuid.UUID

    model_config = {"from_attributes": True}


class VehicleUpdate(BaseModel):
    license_plate: str | None = Field(default=None, max_length=7)
    vin: str | None = Field(default=None, min_length=17, max_length=17)
    brand: str | None = Field(default=None, max_length=50)
    model: str | None = Field(default=None, max_length=50)

    @field_validator("license_plate")
    @classmethod
    def validate_plate(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.replace(" ", "").upper()

        if not PLATE_REGEX.match(value):
            raise ValueError("Invalid Italian license plate format")

        return value
