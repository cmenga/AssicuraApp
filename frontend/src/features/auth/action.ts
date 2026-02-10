import type {
  UserRegisterDTO,
  UserAddress,
  UserData,
  UserLicense,
} from "./type";
import type { ActionResponse } from "@/shared/type";
import { store } from "@/shared/store";
import { authApi } from "@/shared/api/http";

/**
 * The function `registerUser` takes user data, address data, and license data, then submits it for
 * user registration.
 * 
 * Args:
 *   formData: The `formData` parameter in the `registerUser` function contains the following data:
 * 
 * Returns:
 *   The `registerUser` function is returning a Promise that resolves to an `ActionResponse`.
 */
export async function registerUser(
  formData: UserData & UserAddress & UserLicense,
): Promise<ActionResponse> {
  
  const licenseData: UserLicense = {
    date_of_birth: formData.date_of_birth,
    license_code: formData.license_code,
    expiry_date: formData.expiry_date,
    issue_date: formData.issue_date,
    license_number: formData.license_number,
  };

  const userData: UserData = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    fiscal_id: formData.fiscal_id,
    date_of_birth: formData.date_of_birth,
    place_of_birth: formData.place_of_birth,
    gender: formData.gender,
    phone_number: formData.phone_number,
    email: formData.email,
    confirm_password: formData.confirm_password,
    password: formData.password,
    accept_terms: formData.accept_terms,
    accept_privacy_policy: formData.accept_privacy_policy,
    subscribe_to_newsletter: formData.subscribe_to_newsletter,
  };
  const userAddress: UserAddress = {
    cap: formData.cap,
    city: formData.city,
    civic_number: formData.civic_number,
    province: formData.province,
    street: formData.street,
    type: formData.type,
  };
  return await submitUser(userData, userAddress, licenseData);
}

/**
 * The function `submitUser` sends user registration data to an API endpoint and handles different
 * response statuses accordingly.
 * 
 * Args:
 *   user (UserData): The `user` parameter in the `submitUser` function represents the data of a user,
 *      such as their name, email, and other personal information. It is of type `UserData`.
 *      address (UserAddress): The `address` parameter in the `submitUser` function represents the address
 *      details of the user. It typically includes fields such as street address, city, state, postal code,
 *      and country. This information is used to identify the physical location of the user.
 *   license (UserLicense): The `license` parameter in the `submitUser` function likely contains
 *      information related to the user's license details, such as license number, expiration date, issuing
 *      authority, etc. This information is necessary for user registration or authentication purposes,
 *      depending on the context of your application.
 * 
 * Returns:
 *   The `submitUser` function returns a Promise that resolves to an `ActionResponse`. The possible
 *   return values are:
 * 1. If the response status is 422, it returns a validation error response.
 * 2. If the response status is 409, it returns a conflict response.
 * 3. If the response status is neither 422 nor 409, it sets a boolean value in the store and returns
 */
async function submitUser(
  user: UserData,
  address: UserAddress,
  license: UserLicense,
): Promise<ActionResponse> {
  const dto: UserRegisterDTO = {
    user: { ...user },
    address: { ...address },
    license: {...license}
  };
  const response = await authApi.post("/sign-up", dto);
  
  switch (response.status) {
    case 422:
      return validationErrorResponse(response.data);
    case 409:
      return {
        message: "409",
        success: false,
        errors: { existing_user: response.data.detail },
      };
  }

  store.set<boolean>("sign-up", true);
  return { success: true, message: "Request Successfull" };
}

/**
 * The function `validationErrorResponse` processes error data and constructs an ActionResponse object
 * with specific error messages based on the error fields.
 * 
 * Args:
 *   data (any): The `validationErrorResponse` function takes in a `data` parameter, which is expected
 *      to be an object containing a `message` property and an `errors` array. The function processes the
 *      `errors` array to generate an `ActionResponse` object with error messages categorized based on
 *      certain conditions related to
 * 
 * Returns:
 *   The function `validationErrorResponse` returns a Promise that resolves to an `ActionResponse`
 *   object. The `ActionResponse` object has the following structure:
 *    - `message`: The message extracted from the input data.
 *    - `errors`: An object containing specific error messages based on the conditions in the function.
 *    - `success`: A boolean value indicating the success status, which is set to `false`.
 */
async function validationErrorResponse(data: any): Promise<ActionResponse> {
  const returnedValue: ActionResponse = {
    message: data["message"],
    errors: {},
    success: false,
  };
  data.errors.forEach((err: any) => {
    const newForm: Record<string, string> = {
      [err.field]: err.message,
    };

    if (newForm["address"]?.toLowerCase().includes("cap")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        cap: newForm["address"],
      };
    } else if (newForm["address"]?.toLowerCase().includes("città")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        residence_province: newForm["address"],
      };
    } else if (newForm["user"]?.toLowerCase().includes("codice fiscale")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        fiscal_id: newForm["user"],
      };
    } else if (newForm["body"]) {
      returnedValue.errors = {
        ...returnedValue.errors,
        license: newForm["body"],
      }
    } else {
      returnedValue.errors = {
        ...returnedValue.errors,
        ...newForm,
      };
    }
  });
  return returnedValue;
}


/**
 * The function `submitUserLogin` handles user login submission and returns appropriate response based
 * on the API call status.
 * 
 * Args:
 *   formData (FormData): The `formData` parameter in the `submitUserLogin` function is expected to be
 *      a FormData object containing user login data such as username and password. This data will be
 *      converted into a plain JavaScript object using `Object.fromEntries(formData)` before being sent to
 *      the server for authentication.
 * 
 * Returns:
 *   The function `submitUserLogin` returns a Promise that resolves to an `ActionResponse` object. The
 *   `ActionResponse` object contains a `message` property indicating the result of the login attempt, an
 *   optional `errors` property providing details about any errors encountered, and a `success` property
 *   indicating whether the login was successful or not.
 */
export async function submitUserLogin(
  formData: FormData,
): Promise<ActionResponse> {
  const data = Object.fromEntries(formData);

  const response = await authApi.post("/sign-in", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  switch (response.status) {
    case 404:
      return {
        message: "User not found",
        errors: { user: response.data.detail },
        success: false,
      };
    case 401:
      return {
        message: "User not authorized",
        errors: { user: response.data.detail },
        success: false,
      };
    case 422:
      return {
        message: "I dati non sono conformi per la richiesta",
        errors: {
          user: "Attualmente il sservizio non è disponibile riprovi più tardi",
        },
        success: false,
      };
  }

  return { message: "Request Successfull", success: true };
}
