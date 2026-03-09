# UML API - Driver License Service

Questo diagramma mostra endpoint e payload principali del servizio (`/v1`).

```mermaid
classDiagram
  class DriverLicenseCreate {
    +date date_of_birth
    +string license_number
    +string license_code  // A|B|C
    +date expiry_date
    +date issue_date
  }

  class DriverLicenseDetail {
    +string id
    +string number
    +string code
    +date expiry_date
    +date issue_date
  }

  class HealthController {
    +GET /v1/health
    +GET /v1/health/live
    +GET /v1/health/ready
  }

  class DriverLicenseController {
    +GET /v1/driver-license/licenses : DriverLicenseDetail[]|null
    +POST /v1/driver-license/add : 204
    +PATCH /v1/driver-license/update/{license_id}
    +DELETE /v1/driver-license/delete/{license_id}
    +POST /v1/driver-license/internal/add/{user_id} : 204
    +DELETE /v1/driver-license/internal/delete-licenses/{user_id}
  }

  DriverLicenseController ..> DriverLicenseCreate : request body
  DriverLicenseController ..> DriverLicenseDetail : response model
```
