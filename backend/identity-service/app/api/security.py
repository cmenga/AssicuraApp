from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt,ExpiredSignatureError, JWTError
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass


from settings import get_secret_key
from api.exceptions import AuthenticationException

oauth_scheme = OAuth2PasswordBearer(tokenUrl="/auth/sign-in")


class HasherPassword:
    bcrypt_context: CryptContext = CryptContext(schemes=["argon2"], deprecated="auto")

    def get_password_hash(self, password: str):
        return self.bcrypt_context.hash(password)

    def verify_password_hash(self, password: str, hashed_password: str):
        return self.bcrypt_context.verify(password, hashed_password)


@dataclass
class AccessTokenData:
    sub: str
    email: str
    exp: str

class AuthJWT:
    ALGHORITM: str = "HS256"
    SECRET_KEY: str = get_secret_key()

    def create_access_token(self, user_id: str, email: str):
        return jwt.encode(
            claims={
                "sub": user_id,
                "email": email,
                "exp": datetime.now(timezone.utc) + timedelta(hours=6),
            },
            algorithm=self.ALGHORITM,
            key=self.SECRET_KEY,
        )

    def create_refresh_token(self, user_id: str):
        return jwt.encode(
            claims={
                "sub": user_id,
                "exp": datetime.now(timezone.utc) + timedelta(days=30),
            },
            algorithm=self.ALGHORITM,
            key=self.SECRET_KEY,
        )

    def decode_access_token(self, token: str):
        try:
            payload = jwt.decode(token, key=self.SECRET_KEY, algorithms=self.ALGHORITM)
            token_decode = AccessTokenData(**payload)
            
        except ExpiredSignatureError:
            raise AuthenticationException("Token scaduto")
        except JWTError:
            raise AuthenticationException("Token non valido")
        
        return token_decode


def get_hasher_password():
    return HasherPassword()


def get_auth_jwt():
    return AuthJWT()
