# Logging

Questa libreria introduce un sistema di logging strutturato basato su structlog, progettato per essere utilizzato in un’architettura a microservizi.

Sono disponibili due modalità di utilizzo:

🔹 Modalità prod

Attivabile tramite to_prod=True.
In questa modalità viene generato un file chiamato app.log contenente tutti i log strutturati del servizio.
Il formato JSON lo rende ideale per sistemi di osservabilità o per strumenti esterni di log parsing.

🔹 Modalità debug

Attivabile tramite to_prod=False.
I log vengono stampati in console in formato leggibile, utile durante lo sviluppo.

La libreria si basa principalmente su structlog, una libreria moderna per il logging strutturato.
Documentazione ufficiale:
<https://www.structlog.org/en/stable/>

## Middleware

La libreria include anche un middleware preconfigurato per il logging automatico delle richieste HTTP.
Il middleware è costruito sopra Starlette, che è alla base di FastAPI.
Non è progettato per essere utilizzato con framework diversi.

``` python
from fastapi import FastAPI
from logging.src.logger import Logger
from logging.src.middleware import LoggerMiddleware

consoleLogger = Logger(name="Service name", to_prod=False).get_logger()

app = FastAPI()

app.add_middleware(LoggerMiddleware,logger=consoleLogger)

@app.get('/')
async def health():
    return {"message": "Service is up and running"}
```
