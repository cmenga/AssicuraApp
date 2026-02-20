import time


# The `CircuitBreaker` class implements a circuit breaker pattern in Python to control access to a
# resource based on failure thresholds and recovery time.
class CircuitBreaker:
    def __init__(self, failure_threshold=3, recovery_time=10):
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time
        self.failures = 0
        self.last_failure_time = None
        self.opened = False

    def record_failure(self):
        """
        The function `record_failure` increments the failure count and updates the last failure time,
        setting a flag to indicate if the failure threshold has been reached.
        """
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.opened = True

    def allow_request(self):
        """
        This function allows a request to proceed if the circuit is not in an "opened" state or has
        recovered from a previous failure.
        
        Returns:
          The method `allow_request` returns a boolean value. It returns `True` if the conditions are
        met for allowing a request, and `False` otherwise.
        """
        if self.opened:
            if self.last_failure_time is not None and (time.time() - self.last_failure_time) > self.recovery_time:
                # Half-open
                self.opened = False
                self.failures = 0
                return True
            return False
        return True
