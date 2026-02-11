# Come inserire dati esterni

Quando voggliamo inserire dati esterni si può usare il metodo di creare la costante dei dati per non accedere sempre ai file interni per ogni convalida.

Ad esempio creiamo uno script che prenda la funzione che popola la varibila dal modulo interno della cartella data, tipo vogliamo le province, dovremmo avere province.json (se usiamo i json) e province.py dove al suo interno c'è la variabile PROVINCE e la funzione load_from_json.

``` python
from typing import Dict, List
from pathlib import Path
from json import load,dumps

ITALY_CITIES: List[Dict] = list()


def load_from_json():
    DATA_DIR: Path = Path(__file__).parent.parent / 'data'
    
    ITALY_CITIES.clear()
    with open(DATA_DIR / "cities.json",'r') as file:
        values = load(file)
        print(dumps(values, indent=3))
```
