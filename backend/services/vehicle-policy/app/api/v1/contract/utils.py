from typing import Sequence

from app.models import InsurancePolicy

def check_insurance(insurance_policies: Sequence[InsurancePolicy], text: str):
    text = text.strip().lower()
    
    for policy in insurance_policies:
        if text in policy.name.strip().lower():
            return policy.id, True

    return None, False
