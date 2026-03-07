# AssicuraApp

AssicuraApp è un app web, pensata per avere a portata di un click le assicurazioni auto, moto e autocarro in un'unica app. Questa app è stata realizzata per la tesi di laurea 2025/2026 destinata all'universita di Pegaso.

## Avvertenze

Il software è stato progettato seguendo le linee guida dell'università, quindi a scopo **ACCADEMICO**, al suo interno ci sono lacune e falle di sicurezza dovute alle richieste dell'università per l'elaborato della tesi. 
Una tra le più grandi è la sicurezza su swaggerUI, in un caso reale le API non dovrebbero essere esposte fuori dai container docker, dovrebbero avere un **Api Gateway** per smistare le chiamate nei relativi micro servizi e infine
servirebbe un sistema che blocchi le chiamate eccessive da parte di una fonte esterna non autorizzata (reperibile nel api gateway), almeno come inizio per la sicurezza, oltre ad attachi come il DDoS che bucherebbe in semplicità questa app.

## Come avviare il progetto
Il progetto è stato pensato per essere fruibile con docker, quindi è richiesta l'istallazione di docker-desktop che trovate al seguente link [docker download](https://github.com/cmenga/AssicuraApp)

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

