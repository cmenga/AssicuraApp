# Diagramma delle classi per identity/v1/auth

```mermaid
classDiagram
  class UserCreate {
    +string email
    +string first_name
    +string last_name
    +date date_of_birth
    +string place_of_birth
    +enum gender(male|female)
    +string fiscal_id
    +string phone_number
    +string password
    +string confirm_password
    +bool accept_privacy_policy
    +bool accept_terms
    +bool subscribe_to_news_letter
  }

  class AddressCreate {
    +string street
    +string civic_number
    +string city
    +string province
    +string cap
    +enum type(residence|domicile)
  }

  class DriverLicenseCreate {
    +date date_of_birth
    +string license_number
    +string license_code
    +date issue_date
    +date expiry_date
  }

  class SignInForm {
    +string username
    +string password
    +string remember_me
  }

  class AccessTokenResponse {
    +string access_token
  }

  class AuthController {
    +POST /v1/auth/sign-up : 204
    +POST /v1/auth/sign-in : 204
    +POST /v1/auth/sign-out : 200
    +POST /v1/auth/protected : 204
    +POST /v1/auth/internal/refresh : 200  <<internal>>
  }

  AuthController ..> UserCreate : request body
  AuthController ..> AddressCreate : request body
  AuthController ..> DriverLicenseCreate : request body
  AuthController ..> SignInForm : form data
  AuthController ..> AccessTokenResponse : response model
```
