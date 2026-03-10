# Diagramma delle classi per vehicle-policy/v1/insurance

```mermaid
classDiagram
  class InsurancePolicyDetail {
    +int id
    +string name
    +string description
    +float price
    +enum vehicle_type(auto|moto|autocarro)
  }

  class InsuranceController {
    +GET /v1/insurance/policies/{type} : InsurancePolicyDetail[]
  }

  InsuranceController ..> InsurancePolicyDetail : response model
```
