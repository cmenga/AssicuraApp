from pathlib import Path
from logging import INFO
from logging.handlers import RotatingFileHandler

from structlog import configure
from structlog import get_logger
from structlog import WriteLoggerFactory
from structlog import make_filtering_bound_logger

from structlog.processors import add_log_level
from structlog.processors import EventRenamer
from structlog.processors import TimeStamper
from structlog.processors import dict_tracebacks
from structlog.processors import JSONRenderer

from structlog.dev import ConsoleRenderer
from os import environ


def prod_configuration():
    """
    The `prod_configuration` function sets up logging configuration for a Python application in
    production environment.
    """
    log_dir = Path("/var/log/assicurapp")
    log_file = log_dir / "app.log"

    log_dir.mkdir(parents=True, exist_ok=True)
    
    file_handler = RotatingFileHandler(
        log_file, maxBytes=10*1024*1024, backupCount=5
    )
    
    configure(
        processors=[
            add_log_level,
            TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
            dict_tracebacks,
            EventRenamer("message"),
            JSONRenderer(),
        ],
        logger_factory=lambda: file_handler,
        wrapper_class=make_filtering_bound_logger(INFO),
    )


def debug_configuration():
    """
    The `debug_configuration` function configures processors for logging and rendering in Python.
    """
    configure(
        processors=[
            add_log_level,
            TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
            EventRenamer("message"),
            ConsoleRenderer(colors=True),
        ],
    )


def get_confige_logger():
    """
    The function `get_confige_logger` determines the configuration settings based on the environment and
    returns a logger.
    
    Returns:
      The function `get_confige_logger()` is returning the result of the function `get_logger()`.
    """

    env = environ.get("ENV")
    if env == "production":
        prod_configuration()
    else:
        debug_configuration()
    return get_logger()


logger = get_confige_logger()
