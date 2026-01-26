from sqlalchemy.orm import Session

from database.models import DriverLicense
from api.security import AccessToken
from api.exceptions import HTTPNotFound

def get_driver_licenses(db: Session, payload: AccessToken):
    licenses = db.query(DriverLicense).filter(
        DriverLicense.user_id == payload["sub"]
    ).all()
    
    if not licenses:
        raise HTTPNotFound("L'utente non ha alcuna patente registrata")
    
    return licenses