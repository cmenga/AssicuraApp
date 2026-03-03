from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import IPasswordHasher
from app.core.exceptions import HTTPNotFound
from app.core.exceptions import HTTPUnauthorized

from app.models import User
from app.models import Token

async def get_user(db: AsyncSession, hasher: IPasswordHasher, email: str, password: str) -> User:
    """
    The function `get_user` retrieves a user from the database based on the provided email and password,
    verifying the password using a hashing algorithm.

    Args:
      db (AsyncSession): The `db` parameter is of type `Session`, which is likely an instance of a database
    session used for querying the database. It is used to interact with the database to retrieve user
    information.
      hasher (IPasswordHasher): The `hasher` parameter in the `get_user` function is an instance of an
    interface or class that provides methods for hashing and verifying passwords. In this context, it is
    used to verify the password provided by the user against the hashed password stored in the database
    for the user being fetched. The
      email (str): The `email` parameter in the `get_user` function is a string that represents the
    email address of the user you are trying to retrieve from the database.
      password (str): The `get_user` function you provided takes in a database session `db`, a password
    hasher `hasher`, an email address `email`, and a password `password` as parameters.

    Returns:
      The function `get_user` is returning the user object fetched from the database based on the
    provided email and password. If the user is not found in the database or if the password does not
    match the hashed password stored in the database, appropriate HTTP exceptions (`HTTPNotFound` or
    `HTTPUnauthorized`) are raised.
    """
    statement = select(User).filter(User.email == email)
    result = await db.execute(statement)
    fetched_user = result.scalar()

    if not fetched_user:
        raise HTTPNotFound("L'utente inserito non esiste")

    if not hasher.verify(password, fetched_user.hashed_password):
        raise HTTPUnauthorized("La passowrd o la mail non corrispondono")

    return fetched_user


async def get_token(db: AsyncSession,*, user_id: str | None = None, token_id: str | None = None) -> Token | None:

    if user_id:
        statement = select(Token).filter(Token.user_id == user_id)
    else:
        statement = select(Token).filter(Token.id == token_id)
        
    result = await db.execute(statement)
    return result.scalar()
