from pydantic import BaseModel, AfterValidator, field_validator, model_validator
from typing import Annotated, Literal
from datetime import date
import re

LicenseCode = Literal["A","B","C"]

def upper_value(value:str):
    return value.upper()

class DriverLicenseIn(BaseModel):
    date_of_birth: date
    license_number: Annotated[str, AfterValidator(upper_value)]
    license_code: Annotated[LicenseCode, AfterValidator(upper_value)]
    expiry_date: date
    issue_date: date
    
    @field_validator("license_number")
    @classmethod
    def validate_license_number(cls, value:str):
        if not re.match(r"^[A-Z]{1}[0-9]{7}[A-Z]{1}$", value):
            raise ValueError("Numero di patente non valido")
        return value
    
    @model_validator(mode="after")
    def validate_license(self):
        # Controllo che la data di rilascio sia minore della scadenza
        if self.issue_date >= self.expiry_date:
            raise ValueError("La data di rilascio non può essere maggiore o uguale alla data di scadenza")
        
        # Calcolo età al momento del rilascio
        age_at_issue = self.issue_date.year - self.date_of_birth.year - (
            (self.issue_date.month, self.issue_date.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
        
        # Età minima per categoria
        min_age_map = {"A": 18, "B": 18, "C": 21}
        min_age = min_age_map[self.license_code.upper()]

        if age_at_issue < min_age:
            raise ValueError(
                f"L'utente ha {age_at_issue} anni, età minima per patente {self.license_code} è {min_age}"
            )
        
        # Controllo scadenza: deve essere esattamente 10 anni dopo rilascio
        expected_expiry = self.issue_date.replace(year=self.issue_date.year + 10)
        if self.expiry_date != expected_expiry:
            raise ValueError(
                f"La scadenza della patente deve essere esattamente 10 anni dopo il rilascio: {expected_expiry}"
            )

        return self
    
class DriverLicenseOut(BaseModel):
    number: str
    code: str
    expiry_date: date
    issue_date: date
    id: str