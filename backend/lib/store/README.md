# Store

**Store** è una libreria che fornisce un sistema di storage in-memory semplice, thread-safe e con scadenza automatica delle chiavi.  
È ideale per applicazioni leggere o architetture a microservizi che richiedono caching, sessioni temporanee o salvataggio volatile.

La libreria gestisce internamente una struttura dati condivisa, con timestamp per ogni chiave, scadenza configurabile e metodi sicuri per manipolare i dati.

---

## Funzionalità principali

🔹 **Storage in-memory**  
Salvataggio di liste di valori indicizzati da chiave.

🔹 **Gestione scadenze automatica**  
Le chiavi vengono eliminate automaticamente quando superano il tempo di validità (`expiration`).

🔹 **Thread-safe**  
Tutte le operazioni utilizzano un lock globale per evitare race condition.

🔹 **Metodi di manipolazione avanzata**

- `add()` – aggiunge o estende valori  
- `read()` – legge i dati con filtering opzionale  
- `update()` – aggiorna o trasforma i valori  
- `clear()` – pulisce i valori di una chiave  
- `delete()` – rimuove completamente la chiave

🔹 **Errori dedicati**

- `InvalidValueType`
- `KeyNotFound`

---

## Installazione

La libreria richiede come unica dipendenza la structlog: <https://www.structlog.org/en/stable/>

```bash
    pip install -r ./store/requirements.txt
```

## Store – Esempi pratici

Questa sezione mostra come utilizzare la libreria `Store` per gestire dati in-memory con scadenza automatica delle chiavi.

---

### 1. Creazione dello store

```python
from store import Store

# Creazione dell'istanza singleton
store = Store()

# Aggiunta di una lista di valori
store.add("numbers", [1, 2, 3])

# Aggiunta di altri valori alla stessa chiave
store.add("numbers", [4, 5])
# Ora store["numbers"] → [1, 2, 3, 4, 5]

# Lettura semplice
values = store.read("numbers")
print(values)  # → [1, 2, 3, 4, 5]

# Lettura con filtro
even = store.read("numbers", func=lambda x: x % 2 == 0)
print(even)  # → [2, 4]

# Aggiornamento senza funzione
store.update("numbers", [6, 7])
# → [1, 2, 3, 4, 5, 6, 7]

# Aggiornamento con trasformazione
store.update("numbers", [], func=lambda x: x * 10)
# → [10, 20, 30, 40, 50, 60, 70]

store.clear("numbers")
# → []

store.delete("numbers")
# Ora "numbers" non esiste più nello store

from store import KeyNotFound, InvalidValueType

try:
    store.read("unknown")
except KeyNotFound as e:
    print("Chiave inesistente:", e)

try:
    store.add("bad", "not-a-list")
except InvalidValueType as e:
    print("Tipo di dato non valido:", e)

import structlog

logger = structlog.get_logger("StoreLogger")
store.logger.boundLogger = logger

store.add("tasks", ["task1", "task2"])
store.read("tasks")
store.delete("tasks")

store.expiration = 10  # 10 secondi
store.add("temp", [1, 2, 3])

# Dopo 10 secondi
import time
time.sleep(11)
print(store.isKeyExpired("temp"))  # → True

```
