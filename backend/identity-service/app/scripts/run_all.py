from settings import logger
from scripts.popular_italy_cities import main as popular_italy_cities


def run_all():
    popular_italy_cities()


if __name__ == "__main__":
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)
