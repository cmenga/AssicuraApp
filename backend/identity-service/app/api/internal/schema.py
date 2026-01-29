from pydantic import BaseModel


class ServiceTokenRequest(BaseModel):
    service_name: str
    service_secret: str


class ServiceTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
