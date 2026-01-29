# Section dedicated to testing internal services

This section contains tests of the **internal services logic** of our application.
Here **the APIs are not tested**, but the individual critical features implemented on the service side.

The `service_test.py` file is just a basic example:

- it will need to be renamed or split based on the actual services of the app (e.g. `user_service_test.py`, `auth_service_test.py`).

A practical example concerns the **user service**:  

- Useful test: Verify that a duplicate user is not created.
- Purpose: to ensure that if a user already exists in the database, the logic prevents the creation of a second record.  
- This type of test verifies the correctness of the **internal logic of the service**, without directly testing the API.
