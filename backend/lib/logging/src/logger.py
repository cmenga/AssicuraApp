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
    name: str
    to_prod: bool

    def _prod_configuration(self):
        configure(
            processors=[
                add_log_level,
                TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
                self.set_process_id,
                dict_tracebacks,
                EventRenamer("message"),
                JSONRenderer(),
            ],
            logger_factory=WriteLoggerFactory(
                file=Path("app").with_suffix(".log").open("wt")
            ),
            wrapper_class=make_filtering_bound_logger(INFO),
        )

    def _debug_configuration(self):
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
        event_dict["process_id"] = get_process_id()
        return event_dict

    def get_logger(self):
        if self.to_prod:
            self._prod_configuration()
        else:
            self._debug_configuration()
        return get_logger(self.name)
