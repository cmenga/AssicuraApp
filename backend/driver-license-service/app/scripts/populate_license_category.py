from settings import logger, get_local_database_url
from database.session import get_session
from database.models import LicenseCategory


categories_to_seed = [
    {"code": "AM", "description": "Ciclomotori (<50cc)", "min_age": 14},
    {"code": "A1", "description": "Moto leggere (125cc)", "min_age": 16},
    {"code": "A2", "description": "Moto medie", "min_age": 18},
    {"code": "A", "description": "Moto potenti (>35kW)", "min_age": 24},
    {"code": "B", "description": "Auto", "min_age": 18},
    {"code": "BE", "description": "Rimorchio con auto", "min_age": 18},
    {"code": "C1", "description": "Camion medi (<7,5t)", "min_age": 18},
    {"code": "C", "description": "Camion (>7,5t)", "min_age": 21},
    {"code": "CE", "description": "Rimorchio con camion", "min_age": 21},
    {"code": "D1", "description": "Minibus <16 posti", "min_age": 21},
    {"code": "D", "description": "Autobus (>16 posti)", "min_age": 24},
    {"code": "DE", "description": "Rimorchio con autobus", "min_age": 24},
]


global file_name
file_name =__file__.split("/")[-1]


def main():
    global file_name
    logger.debug("script.populate_database", name="populate_license_catecory", script=file_name, status="start")
    LocalSession = get_session(get_local_database_url())
    with LocalSession() as session:
        logger.debug("script.create_session",name="populate_license_catecory", script=file_name, status="up")
        for category in categories_to_seed:
            exists = session.get(entity=LicenseCategory, ident=category["code"])
            
            if not exists:
                logger.debug("script.add_category",name="populate_license_catecory", script=file_name, status="up")
                session.add(LicenseCategory(**category, is_active=True))
                continue
            logger.debug("script.skip_category",name="populate_license_catecory", script=file_name, status="up")

        try:
            session.commit()
            logger.debug("script.success_commit",name="populate_license_catecory", script=file_name, status="up")
        except Exception as ex:
            session.rollback()
            logger.exception(ex, name="populate_license_catecory", script=file_name, status="exception")
            
if __name__ == "__main__":
    try:
        main()
    except Exception as ex:
        logger.exception(ex,name="populate_license_catecory", script=file_name, status="exception")
