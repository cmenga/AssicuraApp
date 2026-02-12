from dataclasses import dataclass
from os import getpid as get_process_id
from pathlib import Path
from logging import INFO

from structlog import (
    configure,
    get_logger,
    WriteLoggerFactory,
    make_filtering_bound_logger,
)
from structlog.processors import (
    add_log_level,
    EventRenamer,
    TimeStamper,
    dict_tracebacks,
    JSONRenderer,
)
from structlog.dev import ConsoleRenderer


@dataclass
class Logger:
    """
    A class for configuring and retrieving loggers based on the environment settings.
    - `name`: The name of the logger.
    - `to_prod`: A boolean indicating whether to configure for production environment.
    """

    name: str
    to_prod: bool

    def _prod_configuration(self):
        """
        Configure the logging settings for the production environment.
        This method sets up various processors and logger settings for logging to a file.
        @return None
        """
        log_path = Path("/var/log/assicurapp/app.log")

        configure(
            processors=[
                add_log_level,
                TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
                self.set_process_id,
                dict_tracebacks,
                EventRenamer("message"),
                JSONRenderer(),
            ],
            logger_factory=WriteLoggerFactory(file=log_path.open("a")),
            wrapper_class=make_filtering_bound_logger(INFO),
        )

    def _debug_configuration(self):
        """
        This method configures the logging processors for the class instance.
        It sets up various processors such as adding log level, timestamping, setting process ID,
        renaming events, and rendering to the console with colors.
        No parameters are passed explicitly as it operates on the instance itself.
        """
        configure(
            processors=[
                add_log_level,
                TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
                self.set_process_id,
                EventRenamer("message"),
                ConsoleRenderer(colors=True),
            ],
        )

    def set_process_id(self, _, __, event_dict):
        """
        Set the process ID in the event dictionary using the `get_process_id()` function.
        @param self - the instance of the class
        @param _ - placeholder parameter
        @param __ - placeholder parameter
        @param event_dict - the dictionary containing event information
        @return The event dictionary with the process ID added
        """
        event_dict["process_id"] = get_process_id()
        return event_dict

    def get_logger(self):
        """
        Retrieve the logger based on the configuration set for production or debugging.
        @return The logger object
        """
        if self.to_prod:
            self._prod_configuration()
        else:
            self._debug_configuration()
        return get_logger(self.name)
