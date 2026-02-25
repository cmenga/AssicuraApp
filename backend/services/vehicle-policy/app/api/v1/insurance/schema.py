from pydantic import BaseModel

from typing import Literal
from typing import List


class InsurancePolicyDetail(BaseModel):
    description: str
    name: str
    price: float
    vehicle_type: Literal["auto", "moto", "autocarro"]
    id: int
