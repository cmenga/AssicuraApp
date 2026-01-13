from typing import Dict, List
from pathlib import Path
from json import load
from settings import logger

ITALY_CITIES: List[Dict] = list()


def load_from_json(script: str | None = None):
    DATA_DIR: Path = Path(__file__).parent.parent / "data"
    logger.debug("script.acquire_data-cities.json", name=__file__, script=script, status="end")

    ITALY_CITIES.clear()
    with open(DATA_DIR / "cities.json", "r") as file:
        values = load(file)
        # print(dumps(values, indent=3))
        for element in values:
            temp = {
                "sail": element["sigla"],
                "name": element["nome"],
                "region": element["regione"]["nome"],
                "province": element["provincia"]["nome"],
                "cap": element["cap"],
            }
            ITALY_CITIES.append(temp)
    logger.debug(f"Single field: {ITALY_CITIES[0]}",name=__file__,script=script, status="check")
    logger.debug("script.acquire_data-cities.json", name=__file__,script=script, status="end")
