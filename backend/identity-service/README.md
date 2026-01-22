# Docker Microservice Template

⚠️ **ATTENZIONE**  
Questo repository è un **template**.  
Prima di usarlo **devi rinominare tutti i riferimenti a `template`** con il nome del tuo servizio/progetto.

## Migrazione alembic in locale

Per effettuare le migrazioni in locale, senza avviare i compose, basta avviare una immagine per postgres o qualsiasi tipologia di dbms in
uso. In questo caso si usa postgres ma può essere qualsiasi.

Oltre questo cambiare l'url per la connessione in app/setting.ty
```docker run -d --name pg_dev -p 5432:5432 -v pgdata:/var/lib/postgresql/data -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=test_db postgres:16```
