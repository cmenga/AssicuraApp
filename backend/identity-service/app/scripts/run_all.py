from settings import logger
from scripts.build_provinces import main as build_provinces_main

def run_all():
    build_provinces_main()

if __name__ == "__main__":
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)
