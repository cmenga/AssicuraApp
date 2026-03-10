# Diagramma di frequenza per vehicle-policy/v1/contract

```mermaid
sequenceDiagram
  autonumber
  actor Client
  participant API as API Gateway / FastAPI
  participant Con as Contract Router
  participant Auth as Identity Service
  participant DB as DB Session
  participant PG as PostgreSQL

  rect rgb(240, 248, 255)
    note over Client,PG: Creazione contratto per veicolo
    Client->>API: POST /v1/contract/add/{type}\n?vehicle_id=...&insurance_ids=1,2,3
    API->>Con: check_active_policies(auth.sub, type, query)
    Con->>DB: check contratto esistente per veicolo
    DB->>PG: SELECT contracts WHERE vehicle_id
    PG-->>DB: none/row
    alt contratto gia presente
      Con-->>API: 409
    else ok
      Con->>DB: SELECT insurance_policies by ids+type
      DB->>PG: SELECT insurance_policies WHERE id IN (...)
      PG-->>DB: rows
      Con->>Con: check_insurance (rca base / rc massimale alto)
      Con->>Con: total_price = sum(prices)
      Con->>DB: INSERT contract + contract_policies
      DB->>PG: INSERT ...
      Con-->>API: 204
    end
    API-->>Client: response
  end

  rect rgb(245, 255, 245)
    note over Client,PG: Lettura contratti utente
    Client->>API: GET /v1/contract/all
    API->>Con: get_contracts(auth.sub)
    Con->>DB: SELECT contracts by owner_id
    DB->>PG: SELECT ...
    PG-->>DB: rows
    Con-->>API: 200 + ContractDetail[]
    API-->>Client: response
  end

  rect rgb(255, 248, 240)
    note over Client,PG: Lettura polizze associate a un contratto
    Client->>API: GET /v1/contract/policies/{contract_id}
    API->>Con: get_insurance_policies(contract_id)
    Con->>DB: SELECT contract + policies
    DB->>PG: SELECT ...
    PG-->>DB: row/none
    alt contratto non trovato
      Con-->>API: 404
    else ok
      Con-->>API: 200 + InsurancePolicyDetail[]
    end
    API-->>Client: response
  end

  rect rgb(240, 255, 252)
    note over Client,Auth: Token refresh (se access token scaduto)
    Client->>API: qualsiasi chiamata protetta
    API->>API: decode cookie assicurapp_token
    API->>Auth: POST /v1/auth/internal/refresh (se necessario)
    Auth-->>API: 200 + new access token
  end
```
