from typing import List, Dict,Any


PROVINCE_OF_ITALY: List[Dict[str, str | List[str]]] = list()

def to_uppercase(value: Any) -> Any:
    """
    The `to_uppercase` function recursively converts strings to uppercase and maintains the structure of
    lists and dictionaries.
    """
    if isinstance(value, str):
        return value.upper()

    if isinstance(value, list):
        return [to_uppercase(v) for v in value]

    if isinstance(value, dict):
        return {k: to_uppercase(v) for k, v in value.items()}

    return value

def load_from_json():
    from pathlib import Path
    from json import load
    
    DATA_DIR: Path = Path(__file__).parent.parent / "data"
    with open(DATA_DIR / "province.json") as file:
        values = load(file)
        PROVINCE_OF_ITALY.clear()
        for value in values:
            PROVINCE_OF_ITALY.append(to_uppercase(value))