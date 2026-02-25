from typing import Sequence

from models import InsurancePolicy

def check_insurance(insurance_policies: Sequence[InsurancePolicy], text: str):
    insurance_id = [
        policy.id for policy in insurance_policies if policy.name.lower() == text
    ]

    if len(insurance_id) > 0:
        return insurance_id[0], True
    return None, False
