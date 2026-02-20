from typing import Dict, List
from pathlib import Path
from json import load

ITALY_CITIES: List[Dict] = list()


def load_from_json():
    DATA_DIR: Path = Path(__file__).parent.parent / "data"

    ITALY_CITIES.clear()
    with open(DATA_DIR / "cities.json", "r") as file:
        values = load(file)
        # print(dumps(values, indent=3))
        for element in values:
            temp = {
                "sail": element["sigla"].upper(),
                "name": element["nome"].upper(),
                "region": element["regione"]["nome"].upper(),
                "province": element["provincia"]["nome"].upper(),
                "cap": element["cap"],
            }
            ITALY_CITIES.append(temp)


load_from_json()
