# Diagramma di Frequenza per identity/v1/auth

``` mermaid
sequenceDiagram
  autonumber
  actor Client
  actor Service as Other Service
  participant API as API Gateway / FastAPI
  participant Auth as Auth Router
  participant DB as DB Session
  participant IDDB as Identity PostgreSQL
  participant DL as Driver License Service

  rect rgb(240, 248, 255)
    note over Client,DL: Registrazione account completo (sign-up)
    Client->>API: POST /v1/auth/sign-up (user + address + license)
    API->>Auth: create_new_account(...)
    Auth->>DB: SELECT users by fiscal_id
    DB->>IDDB: SELECT users
    IDDB-->>DB: none
    Auth->>DB: INSERT users / addresses
    DB->>IDDB: INSERT users / addresses
    Auth->>DL: POST /v1/driver-license/internal/add/{user_id}
    DL-->>Auth: 204
    Auth-->>API: 204
    API-->>Client: no content
  end

  rect rgb(245, 255, 245)
    note over Client,IDDB: Login (sign-in)
    Client->>API: POST /v1/auth/sign-in (form: username+password+remember_me)
    API->>Auth: get_access_token(...)
    Auth->>DB: SELECT users by email + verify password
    DB->>IDDB: SELECT users
    IDDB-->>DB: row
    alt remember_me=off
      Auth-->>API: set-cookie assicurapp_token (6h)
    else remember_me=on
      Auth-->>API: set-cookie assicurapp_token (15m)
      Auth->>DB: SELECT tokens by user_id
      DB->>IDDB: SELECT tokens
      IDDB-->>DB: none/expired/valid
      opt token assente o scaduto
        Auth->>DB: INSERT token refresh
        DB->>IDDB: INSERT tokens
        Auth-->>API: set-cookie assicurapp_session (7d)
      end
    end
    API-->>Client: 204
  end

  rect rgb(255, 248, 240)
    note over Client,IDDB: Logout (sign-out)
    Client->>API: POST /v1/auth/sign-out
    API->>Auth: logout(assicurapp_session?)
    opt assicurapp_session presente
      Auth->>DB: SELECT tokens by id
      DB->>IDDB: SELECT tokens
      IDDB-->>DB: row
      Auth->>DB: DELETE tokens
      DB->>IDDB: DELETE tokens
    end
    Auth-->>API: clear-cookie assicurapp_token + assicurapp_session
    API-->>Client: 200
  end

  rect rgb(248, 240, 255)
    note over Client,Auth: Verifica token (protected)
    Client->>API: POST /v1/auth/protected
    API->>Auth: verify_token(auth payload)
    Auth-->>API: 204
    API-->>Client: no content
  end

  rect rgb(240, 255, 252)
    note over Service,IDDB: Refresh access token (internal)
    Service->>API: POST /v1/auth/internal/refresh (Bearer service-token + access_token)
    API->>Auth: refresh_access_token(...)
    Auth->>Auth: validate service-token (trusted service)
    Auth->>DB: SELECT tokens by user_id (sub)
    DB->>IDDB: SELECT tokens
    IDDB-->>DB: row/none
    alt session valida
      Auth-->>API: 200 + {access_token}
    else session assente/scaduta
      Auth-->>API: 401
    end
    API-->>Service: response
  end
```
