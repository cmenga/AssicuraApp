import time
import pytest

from src.store import Store, InvalidValueType, KeyNotFound

@pytest.fixture(autouse=True)
def reset_store_singleton():
    Store._instance = None
    yield
    Store._instance = None


def test_add_and_read_basic():
    s = Store()
    key = "user:1"
    vals = [1, 2, 3]

    s.add(key, vals)

    out = s.read(key)
    assert out == vals
    assert out is not vals 

    assert key in s._keys
    assert key in s._timestamps
    assert key in s._data


def test_add_extends_existing_list_and_timestamps_update():
    s = Store()
    key = "u2"
    s.add(key, [1, 2])
    ts1 = s._timestamps[key]
    time.sleep(0.01)
    s.add(key, [3])

    assert s.read(key) == [1, 2, 3]
    assert s._timestamps[key] > ts1


def test_update_with_map_and_clear_delete():
    s = Store()
    key = "u3"
    s.add(key, [1, 2, 3])

    s.update(key, [0], func=lambda x: x * 2)
    assert s.read(key) == [2, 4, 6]

    s.clear(key)
    assert s.read(key) == []

    s.delete(key)
    assert key not in s._keys

    with pytest.raises(KeyNotFound):
        s.read(key)


def test_type_validation_rejects_non_list():
    s = Store()
    with pytest.raises(InvalidValueType):
        s.add("k", {"not": "a list"}) # type: ignore

    with pytest.raises(InvalidValueType):
        s.add("k2", [])
        s.update("k2", ("tuple",)) # type: ignore


def test_read_with_filter():
    s = Store()
    key = "filter_key"
    s.add(key, [1, 2, 3, 4, 5])

    out = s.read(key, func=lambda x: x % 2 == 0)
    assert out == [2, 4]


def test_cleanup_removes_expired_keys():
    s = Store()
    key = "temp"
    s.add(key, [1])

    s._timestamps[key] = s._timestamps[key] - (s.expiration + 1)
    s._cleanup()

    assert key not in s._data
    assert key not in s._timestamps
    assert key not in s._keys
    assert s.isKeyExpired(key) is True


def test_isKeyExpired_behaviour():
    """
    The function `test_isKeyExpired_behaviour` tests the behavior of the `isKeyExpired` method in a
    `Store` class.
    """
    s = Store()
    assert s.isKeyExpired("nonexistent") is True
    s.add("exists", [1])
    assert s.isKeyExpired("exists") is False
    s.delete("exists")
    assert s.isKeyExpired("exists") is True