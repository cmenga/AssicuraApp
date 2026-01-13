from settings import logger
from data import cities

def main():
    cities.load_from_json(__file__)
    

if __name__ == "__main__":
    try:
        main()
    except Exception as ex:
        logger.exception(ex)