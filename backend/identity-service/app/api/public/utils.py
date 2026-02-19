from sqlalchemy.orm import Session

from core.security import IPasswordHasher

from core.exceptions import HTTPNotFound
from core.exceptions import HTTPUnauthorized

from database.models import User
from database.models import Address
from database.models import Token


def get_user(db: Session, hasher: IPasswordHasher, email: str, password: str) -> User:
    """
    The function `get_user` retrieves a user from the database based on the provided email and password,
    verifying the password using a hashing algorithm.
    
    Args:
      db (Session): The `db` parameter is of type `Session`, which is likely an instance of a database
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
    fetched_user = db.query(User).filter(User.email == email).first()

    if not fetched_user:
        raise HTTPNotFound("L'utente inserito non esiste")

    if not hasher.verify(password, fetched_user.hashed_password):
        raise HTTPUnauthorized("La passowrd o la mail non corrispondono")

    return fetched_user


def get_current_user(db: Session, user_id: str):
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
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPNotFound("Utente non trovato")
    return user


def get_addresses(db: Session, user_id: str):
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
    fetched_address = db.query(Address).filter(Address.user_id == user_id).all()
    if not fetched_address:
        raise HTTPNotFound("Non esistono indirizzi per questo utente")
    return fetched_address


def get_user_session_token(db: Session, user_id: str) -> Token | None:
    """
    The function `get_user_session_token` retrieves a user's session token from the database based on
    the user ID.
    
    Args:
      db (Session): The `db` parameter is of type `Session`, which likely represents a database session
    object used for querying the database.
      user_id (str): User ID is a unique identifier for a user in the system. It is used to distinguish
    one user from another and is typically a string value.
    
    Returns:
      The function `get_user_session_token` returns either an instance of `Token` if a token is found in
    the database for the specified `user_id`, or `None` if no token is found.
    """
    fetched_token = db.query(Token).filter(Token.user_id == user_id).first()
    if not fetched_token:
        return None
    return fetched_token
