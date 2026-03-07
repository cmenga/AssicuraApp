# AssicuraApp

L’applicazione rappresenta un prototipo di piattaforma web per la consultazione e la sottoscrizione di polizze assicurative online, ispirato a servizi presenti sul mercato come Prima.it. L’obiettivo principale del progetto è stato quello di simulare il funzionamento di un sistema digitale per la gestione di polizze assicurative, senza la necessità di recarsi fisicamente presso una sede.

Durante lo sviluppo sono state utilizzate tecnologie moderne per la realizzazione di applicazioni web, tra cui FastAPI per il backend, React per l’interfaccia frontend e Docker per la containerizzazione dei servizi, con il supporto di GitHub per la gestione del codice e del versionamento.

## Avvertenze

Il presente software è stato sviluppato seguendo le linee guida dell’Università Telematica Pegaso ed è stato realizzato principalmente a scopo accademico nell’ambito del progetto di tesi.

Considerata la natura accademica del progetto e i tempi limitati di sviluppo, alcune scelte architetturali e di sicurezza sono state volutamente semplificate. Ad esempio, le API risultano direttamente esposte per facilitare le attività di sviluppo e test tramite strumenti come Swagger UI. In un contesto reale di produzione, tali servizi verrebbero generalmente gestiti tramite un API Gateway, incaricato di instradare le richieste verso i microservizi interni, limitare il numero di chiamate alle API e migliorare i meccanismi di sicurezza e controllo del traffico.

Il progetto deve pertanto essere considerato come un prototipo **dimostrativo**, finalizzato a mostrare la struttura generale dell’applicazione e l’integrazione tra le diverse tecnologie utilizzate.

## Come avviare il progetto
Il progetto è stato configurato per essere eseguito tramite container Docker, quindi è richiesta l'istallazione di docker-desktop che trovate al seguente link [docker download](https://github.com/cmenga/AssicuraApp)

Una volta eseguita la procedura di installazione vi basterà clonare il progetto e lanciare il compose nella cartella contenete il docker-compose.yml.

``` sh
docker compose up --build
```

se avete una versione meno recente di docker, inferiore alla 4.x.x:

``` sh
docker-compose up --build
```

il target base del progetto è la versione di sviluppo, in caso si voglia testare la parte di produzione bisogna cambiare i target realtivi al docker-compose.yml, e lanciare il comando sopra citato.

``` yml
services:
  identity-service:
    build:
      target: prod
  ...
  driver-license-service:
    build:
      target: prod
  ...
  vehicle-policy-service:
    build:
      target: prod
  ...
```

