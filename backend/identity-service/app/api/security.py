from passlib.context import CryptContext
from jose import jwt, ExpiredSignatureError, JWTError
from datetime import datetime, timezone, timedelta

from typing import Protocol, TypedDict, Literal
from abc import abstractmethod

from settings import get_secret_key
from api.exceptions import HTTPUnauthorized


class IPasswordHasher(Protocol):
    @abstractmethod
    def hash(self, password: str) -> str: ...
    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool: ...


class Argon2Hasher(IPasswordHasher):
    bcrypt_context: CryptContext = CryptContext(schemes=["argon2"], deprecated="auto")

    def hash(self, password: str):
        return self.bcrypt_context.hash(password)

    def verify(self, password: str, hashed: str):
        return self.bcrypt_context.verify(password, hashed)


class Token(TypedDict):
    sub: str
    exp: int
    type: Literal["access", "refresh"]


class IJWTService(Protocol):
    ALGHORITM: str
    SECRET_KEY: str

    @abstractmethod
    def decode(self, token: str) -> Token: ...
    @abstractmethod
    def encode(
        self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0
    ) -> str: ...


class AccessTokenBearer(IJWTService):
    ALGHORITM: str = "HS256"
    SECRET_KEY: str = get_secret_key()

    def encode(
        self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0
    ) -> str:

        expire = datetime.now(timezone.utc) + timedelta(
            days=days, hours=hours, minutes=minutes
        )
        claims = {"sub": user_id, "type": "access", "exp": expire.timestamp()}
        return jwt.encode(claims=claims, key=self.SECRET_KEY, algorithm=self.ALGHORITM)

    def decode(self, token: str) -> Token:
        try:
            payload = jwt.decode(token, key=self.SECRET_KEY, algorithms=self.ALGHORITM)
            return Token(**payload)
        except ExpiredSignatureError:
            raise HTTPUnauthorized("Token scaduto")
        except JWTError:
            raise HTTPUnauthorized("Token non valido")


class RefreshTokenBearer(IJWTService):
    ALGHORITM = "HS256"
    SECRET_KEY = get_secret_key()

    def encode(
        self, user_id: str, days: int = 0, hours: int = 0, minutes: int = 0
    ) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=days, hours=hours, minutes=minutes
        )
        claims = {"sub": user_id, "type": "refresh", "exp": expire.timestamp()}
        return jwt.encode(claims=claims, key=self.SECRET_KEY, algorithm=self.ALGHORITM)

    def decode(self, token: str) -> Token:
        try:
            payload = jwt.decode(token, key=self.SECRET_KEY, algorithms=self.ALGHORITM)
            return Token(**payload)
        except ExpiredSignatureError:
            raise HTTPUnauthorized("Token scaduto")
        except JWTError:
            raise HTTPUnauthorized("Token non valido")
