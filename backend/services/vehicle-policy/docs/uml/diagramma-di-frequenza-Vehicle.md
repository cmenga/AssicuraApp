# Diagramma di frequenza per vehicle-policy/v1/vehicle

```mermaid
sequenceDiagram
  autonumber
  actor Client
  participant API as API Gateway / FastAPI
  participant Veh as Vehicle Router
  participant Auth as Identity Service
  participant DB as DB Session
  participant PG as PostgreSQL

  rect rgb(240, 248, 255)
    note over Client,PG: Lettura veicoli utente
    Client->>API: GET /v1/vehicle/vehicles
    API->>Veh: get_vehicles(auth.sub)
    Veh->>DB: SELECT vehicles by user_id
    DB->>PG: SELECT ...
    PG-->>DB: rows
    Veh-->>API: 200 + VehicleDetail[]
    API-->>Client: response
  end

  rect rgb(245, 255, 245)
    note over Client,PG: Inserimento nuovo veicolo
    Client->>API: POST /v1/vehicle/add\n(VehicleCreate)
    API->>Veh: add_vehicle(auth.sub, payload)
    Veh->>DB: check vin gia registrato per utente
    DB->>PG: SELECT vehicles WHERE user_id+vin
    PG-->>DB: none/row
    alt esiste gia
      Veh-->>API: 409
    else ok
      Veh->>DB: INSERT vehicles
      DB->>PG: INSERT ...
      Veh-->>API: 204
    end
    API-->>Client: response
  end

  rect rgb(255, 248, 240)
    note over Client,PG: Aggiornamento veicolo
    Client->>API: PATCH /v1/vehicle/update/{vehicle_id}\n(VehicleUpdate)
    API->>Veh: update_vehicle(auth.sub, vehicle_id, payload)
    Veh->>DB: SELECT vehicles by id+user_id
    DB->>PG: SELECT ...
    PG-->>DB: row/none
    alt non trovato
      Veh-->>API: 404
    else ok
      Veh->>DB: UPDATE vehicles
      DB->>PG: UPDATE ...
      Veh-->>API: 204
    end
    API-->>Client: response
  end

  rect rgb(248, 240, 255)
    note over Client,PG: Cancellazione veicolo (solo se senza contratto)
    Client->>API: DELETE /v1/vehicle/delete/{vehicle_id}
    API->>Veh: delete_vehicle(auth.sub, vehicle_id)
    Veh->>DB: SELECT vehicles by id+user_id
    DB->>PG: SELECT ...
    PG-->>DB: row/none
    alt non trovato
      Veh-->>API: 404
    else ok
      Veh->>DB: check contracts for vehicle
      DB->>PG: SELECT contracts WHERE vehicle_id
      PG-->>DB: none/row
      alt contratto presente
        Veh-->>API: 409
      else nessun contratto
        Veh->>DB: DELETE vehicles
        DB->>PG: DELETE ...
        Veh-->>API: 204
      end
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
