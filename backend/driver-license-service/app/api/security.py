from fastapi.security import OAuth2PasswordBearer


oauth_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8001/auth/sign-in")
