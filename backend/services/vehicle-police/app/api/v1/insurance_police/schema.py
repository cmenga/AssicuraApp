from pydantic import BaseModel

from typing import Literal


class InsurancePoliceDetail(BaseModel):
    description: str
    name: str
    price: float
    vehicle_type: Literal["auto", "moto", "autocarro"]
    id: int
