from settings import logger
from data import province

def main():
    province.load_from_json()

if __name__ == "__main__":
    try:
        main()
    except Exception as ex:
        logger.exception(ex)