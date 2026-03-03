from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence

from app.models import User
from app.models import Address
from app.models import Token

from app.core.exceptions import HTTPNotFound


async def get_current_user(db: AsyncSession, user_id: str) -> User:
    """
    The function `get_current_user` retrieves a user from the database based on the provided user ID.

    Args:
      db (Session): The `db` parameter is of type `Session`, which is likely a database session object
    used for interacting with the database. It is commonly used in SQLAlchemy to perform database
    operations.
      user_id (str): The `user_id` parameter is a unique identifier for a user in the database. It is
    used to query the database and retrieve the user information based on this identifier.

    Returns:
      The function `get_current_user` is returning the user object corresponding to the provided
    `user_id` from the database. If the user is not found, it raises an HTTPNotFound exception with the
    message "Utente non trovato".
    """
    statement = select(User).filter(User.id == user_id)
    result = await db.execute(statement)
    try:
        return result.scalar_one()
    except:
        raise HTTPNotFound("Utente non trovato")

async def get_addresses(db: AsyncSession, user_id: str) -> Sequence[Address]:
    """
    The function `get_addresses` retrieves addresses from a database for a specific user ID and raises
    an exception if no addresses are found.
    
    Args:
      db (Session): The `db` parameter is of type `Session`, which is likely an instance of a database
    session that allows you to interact with the database. It is used to query the database for
    addresses associated with a specific user.
      user_id (str): The `get_addresses` function takes two parameters: `db` which is a database session
    and `user_id` which is a string representing the user's ID. The function retrieves addresses from
    the database that are associated with the provided `user_id`. If no addresses are found for the
    given `user
    
    Returns:
      The function `get_addresses` returns a list of addresses associated with the specified `user_id`
    from the database. If no addresses are found for the user, it raises an HTTPNotFound exception with
    the message "Non esistono indirizzi per questo utente".
    """
    statement = select(Address).filter(Address.user_id == user_id)
    result = await db.execute(statement)
    fetched_address = result.scalars().all()
    
    if not fetched_address:
        raise HTTPNotFound("Non esistono indirizzi per questo utente")
    return fetched_address
  
  
async def get_user_session_token(db: AsyncSession, user_id: str | None = None) -> Token | None:
    statement = select(Token).filter(Token.user_id == user_id)
    result = await db.execute(statement)
    return result.scalar()