from settings import logger


def run_all():
    pass

if __name__ == "__main__":
    try:
        run_all()
    except Exception as ex:
        logger.exception(ex)
