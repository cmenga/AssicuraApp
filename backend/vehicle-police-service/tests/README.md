# Section dedicated to API testing

This section contains tests of our application's **endpoints**.  
Here the following are mainly verified:

- Correct management of HTTP requests and responses
- The status codes returned (200, 201, 400, 409, etc.)
- Serialization and deserialization of data
- Correct functioning of dependencies (e.g. authentication or database access)

Files can be organized by resource or feature, for example:

- `test_users.py` for user endpoints
- `test_auth.py` for authentication  
- `test_health.py` for app health check endpoints

Practical example: Testing the user creation endpoint

- Normal case: the user is created correctly → check 201
- Edge case: user already exists → check 409 (non-duplication)  
- These tests test behavior **at the API level**, not the internal logic of the services, which is tested separately in the services section.
