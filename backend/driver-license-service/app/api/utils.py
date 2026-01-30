from sqlalchemy.orm import Session

from database.models import DriverLicense


def get_driver_licenses(db: Session, user_id: str):
    licenses = db.query(DriverLicense).filter(
        DriverLicense.user_id == user_id
    ).all()
    return licenses