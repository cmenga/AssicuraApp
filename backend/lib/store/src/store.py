import atexit
from threading import Thread, Lock
from structlog import BoundLogger

from time import sleep, monotonic
from typing_extensions import Self, Dict, List, LiteralString, Any, AnyStr, Callable



class StoreError(Exception):
    pass
class KeyNotFound(StoreError):
    pass
class InvalidValueType(StoreError):
    pass



# This class is a logger with methods for logging messages at different severity levels.
class _Logger:
    boundLogger: BoundLogger | None = None
    name: LiteralString = "Store"

    def _log(self, level: str, *args, **kwargs):
        if self.boundLogger:
            getattr(self.boundLogger, level)(*args, **kwargs)

    def debug(self, *args, **kwargs):
        self._log("debug", *args, **kwargs)

    def info(self, *args, **kwargs):
        self._log("info", *args, **kwargs)

    def warning(self, *args, **kwargs):
        self._log("warning", *args, **kwargs)

    def error(self, *args, **kwargs):
        self._log("error", *args, **kwargs)

    def critical(self, *args, **kwargs):
        self._log("critical", *args, **kwargs)

    def exception(self, *args, **kwargs):
        self._log("exception", *args, **kwargs)


# The `Store` class in Python provides methods for managing and manipulating data with key-value
# pairs, including adding, reading, updating, clearing, and deleting data while handling expiration
# and logging operations.
class Store:
    _instance: Self | None = None
    _data: Dict[LiteralString, List[Any]]
    _timestamps: Dict[LiteralString, float]
    _keys: List[LiteralString]
    _lock: Lock
    expiration: int = 15 * 60
    logger: _Logger = _Logger()

    def __new__(cls) -> Self:
        def delete():
            cls.logger.info("store.delete.end_program",name=Store().logger.name,function=atexit.register.__name__)
            del cls._instance
                
        if cls._instance is None:
            atexit.register(delete)
            cls._instance = super().__new__(cls)
            cls._instance._data = {}
            cls._instance._keys = []
            cls._instance._timestamps = {}
            cls._instance._lock = Lock()
            cls._instance._strat_cleaner()

        return cls._instance

    def _strat_cleaner(self):
        """
        The `_strat_cleaner` function creates a separate thread that runs a cleaning operation every 60
        seconds.
        """
        def cleaner():
            while True:
                sleep(60)
                self._cleanup()

        thread = Thread(target=cleaner, daemon=True)
        thread.start()

    def _cleanup(self):
        """
        The `_cleanup` function removes expired keys from a data structure while logging the cleanup
        process.
        """
        now = monotonic()
        with self._lock:
            expired_keys: List[LiteralString] = [
                key
                for key, timestamp in self._timestamps.items()
                if now - timestamp > self.expiration
            ]
            
            for key in expired_keys:
                self.logger.info("Clean up", key=key, name=self.logger.name)
                self._keys.remove(key)
                del self._data[key]
                del self._timestamps[key]

    def add(self, key: LiteralString, value: List[Any]) -> None:
        """
        This Python function adds data for a given key to a dictionary-like object, handling type validation
        and timestamping.
        """
        self.logger.info("store.add.attempt", key=key, items=len(value), store=self.logger.name)
        self._type_validation(self.add.__name__, value)
        
        with self._lock:
            if key not in self._data:
                self._keys.append(key)
                self._data[key] = value
                self._timestamps[key] = monotonic()
                self.logger.info("store.add.created", key=key, items=len(value), store=self.logger.name)
                return

            self._data[key].extend(value)
            self._timestamps[key] = monotonic()
            self.logger.info("store.add.extended", key=key, new_items=len(value), total_items=len(self._data[key]), store=self.logger.name)

    def read(self, key: LiteralString, func: Callable | None = None) -> List[Any] | None:
        """
        This Python function reads data for a specified key and optionally applies a filtering function
        before returning the data.
        """
        self.logger.info("store.read.attempt", key=key, store=self.logger.name)
        self._key_validation(key)
        
        with self._lock:
            self._timestamps[key] = monotonic()
            if func is None:
                self.logger.debug("store.read.return", key=key, items=len(self._data[key]), store=self.logger.name)
                return self._data[key].copy()
            
            result: List[Any] = list(filter(func, self._data[key])) 
            self.logger.debug("store.read.return_filtered", key=key, returned=len(result), store=self.logger.name)
            return result

    def update(self, key: LiteralString, value: List[Any], func: Callable | None = None) -> None:
        """
        The `update` function in Python is used to update data for a specific key, with optional
        transformation using a provided function.
        """
        self.logger.info("store.update.attempt", key=key, provided_items=len(value), store=self.logger.name)
        self._key_validation(key)
        self._type_validation(self.update.__name__, value)
        
        with self._lock:
            self._timestamps[key] = monotonic()
            if func is None:
                self._data[key].extend(value)
                self.logger.info("store.update.extended", key=key, added=len(value), total=len(self._data[key]), store=self.logger.name)
                return
            self._data[key] = list(map(func, self._data[key]))
            self.logger.info("store.update.mapped", key=key, total=len(self._data[key]), store=self.logger.name)

    def clear(self, key: LiteralString):
        """
        The `clear` function clears data associated with a specific key and logs the action.
        """
        self._key_validation(key)
        with self._lock:
            self._timestamps[key] = monotonic()
            self._data[key].clear()
            self.logger.info("store.clear", key=key, store=self.logger.name)

    def delete(self, key: LiteralString) -> None:
        """
        This Python function deletes a key from a data store while logging the action.
        """
        self._key_validation(key)
        with self._lock:
            self._keys.remove(key)
            del self._timestamps[key]
            del self._data[key]
            self.logger.info("store.delete", key=key, store=self.logger.name)
    
    def isKeyExpired(self, key: LiteralString) -> bool:
        """
        The function `isKeyExpired` checks if a given key is expired based on its presence in a collection
        of keys.
        """
        return key not in self._keys
    
    def _type_validation(self, _name: AnyStr, value: Any):
        """
        The `_type_validation` function checks if a value is a list and raises an exception if it is not.
        """
        if not isinstance(value, list):
            self.logger.critical(
                "store.invalid_value",
                function=_name,
                expected="List[Any]",
                received_type=type(value).__name__,
                store=self.logger.name,
            )
            raise InvalidValueType(f'The value passed to the "{_name}" function is incorrect; it only accepts List[Any].')

    def _key_validation(self, key: LiteralString):
        """
        The `_key_validation` function checks if a given key exists in a list and raises an exception if it
        does not.
        """
        if key not in self._keys:
            self.logger.critical("store.key_not_found", key=key, store=self.logger.name)
            raise KeyNotFound(f"The {key} key is non exist or expired")


