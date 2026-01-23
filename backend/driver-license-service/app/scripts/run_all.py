from settings import logger

from scripts.populate_license_category import main as populate_license_category_main


def run_all():
    populate_license_category_main()


if __name__ == "__main__":
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)
