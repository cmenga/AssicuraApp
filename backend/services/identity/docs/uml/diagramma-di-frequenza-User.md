# Diagramma di frequenza per identity/v1/user

```mermaid
sequenceDiagram
  autonumber
  actor Client
  participant API as API Gateway / FastAPI
  participant UserR as User Router
  participant Hasher as Password Hasher
  participant DB as DB Session
  participant IDDB as Identity PostgreSQL
  participant DL as Driver License Service

  rect rgb(240, 248, 255)
    note over Client,IDDB: Profilo utente
    Client->>API: GET /v1/user/me
    API->>UserR: get_logged_user(auth.sub)
    UserR->>DB: SELECT users by id
    DB->>IDDB: SELECT users
    IDDB-->>DB: row
    UserR-->>API: 200 + UserDetail
    API-->>Client: response
  end

  rect rgb(245, 255, 245)
    note over Client,IDDB: Indirizzi utente
    Client->>API: GET /v1/user/addresses
    API->>UserR: get_user_address(auth.sub)
    UserR->>DB: SELECT addresses by user_id
    DB->>IDDB: SELECT addresses
    IDDB-->>DB: rows
    UserR-->>API: 200 + AddressDetail[]
    API-->>Client: response
  end

  rect rgb(255, 248, 240)
    note over Client,IDDB: Aggiornamento contatti
    Client->>API: PATCH /v1/user/update-contact (ContactUpdate)
    API->>UserR: update_contact(auth.sub, payload)
    UserR->>DB: SELECT users by id
    DB->>IDDB: SELECT users
    IDDB-->>DB: row
    UserR->>DB: UPDATE users (email/phone)
    DB->>IDDB: UPDATE users
    UserR-->>API: 204
    API-->>Client: no content
  end

  rect rgb(248, 240, 255)
    note over Client,IDDB: Aggiornamento indirizzo (primo record)
    Client->>API: PUT /v1/user/update-address (AddressUpdate)
    API->>UserR: update_address(auth.sub, payload)
    UserR->>DB: SELECT addresses by user_id
    DB->>IDDB: SELECT addresses
    IDDB-->>DB: rows
    UserR->>DB: UPDATE addresses (first)
    DB->>IDDB: UPDATE addresses
    UserR-->>API: 204
    API-->>Client: no content
  end

  rect rgb(240, 255, 252)
    note over Client,Hasher: Cambio password
    Client->>API: PATCH /v1/user/change-password (PasswordUpdate)
    API->>UserR: change_password(auth.sub, payload)
    UserR->>DB: SELECT users by id
    DB->>IDDB: SELECT users
    IDDB-->>DB: row
    UserR->>Hasher: verify(old_password)
    Hasher-->>UserR: ok/ko
    alt ok
      UserR->>Hasher: hash(new_password)
      Hasher-->>UserR: hashed
      UserR->>DB: UPDATE users.hashed_password
      DB->>IDDB: UPDATE users
      UserR-->>API: 204
    else ko
      UserR-->>API: 403
    end
    API-->>Client: response
  end

  rect rgb(255, 245, 245)
    note over Client,DL: Eliminazione account
    Client->>API: DELETE /v1/user/delete
    API->>UserR: delete_user(...)
    UserR->>DB: SELECT users by id
    DB->>IDDB: SELECT users
    IDDB-->>DB: row
    UserR->>DB: SELECT tokens by user_id (session)
    DB->>IDDB: SELECT tokens
    IDDB-->>DB: row/none
    UserR->>DL: DELETE /v1/driver-license/internal/delete-licenses/{user_id}
    DL-->>UserR: 200
    opt token presente
      UserR->>DB: DELETE tokens
      DB->>IDDB: DELETE tokens
    end
    UserR->>DB: DELETE users (cascade addresses)
    DB->>IDDB: DELETE users/addresses
    UserR-->>API: clear cookies + 204
    API-->>Client: no content
  end
```
