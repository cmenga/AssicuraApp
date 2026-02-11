"""
This is just an example of an internal router. From here, all internal API calls to other services will be made.
Remember to always update the .env file whenever adding a new service.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/internal",include_in_schema=False)
