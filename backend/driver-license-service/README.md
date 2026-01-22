# Docker Microservice Template

⚠️ **ATTENZIONE**  
Questo repository è un **template**.  
Prima di usarlo **devi rinominare tutti i riferimenti a `template`** con il nome del tuo servizio/progetto.

## Migrazione alembic in locale

Per effettuare le migrazioni in locale, senza avviare i compose, basta avviare una immagine per postgres o qualsiasi tipologia di dbms in
uso. In questo caso si usa postgres ma può essere qualsiasi DBMS.
Ecco un esempio per docker con postgresql:

``` sh
docker run -d --name pg_dev -p 8432:5432 -v pgdata:/var/lib/postgresql/data -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=test_db postgres:16
```

Una volta configurato il nostro DBMS locale per accedere in locale, dobbiamo cambiare la stringa per alembic (DA RICORDARE alembic prenderà sempre la stringa contenuta nell'env di docker se attivo), possiamo trovare la stringa di connessione in app/settings.py:

``` python
def get_alembic_database_url():
    try:
        return get_database_url()
    except:
        # Alembic requires a reachable (online) database to run migrations.
        # When Docker services are not running, an external/local connection string
        # (e.g. localhost) must be provided instead of a Docker service name.
        return "postgresql://admin:admin@localhost:8432/test_db"  # Example for postgres, use your local connection string

```

bisogna cambiare la stringa nella except per connettersi in locale.
