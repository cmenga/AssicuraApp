import { authApi } from "@/api/auth-service";
import type { UserRegisterDTO, UserAddress, UserData, UserLicense, ActionResponse } from "@/type/auth.register.type";


/**
 * The function `registerUser` saves user data and license data in local storage and then submits user
 * basics to a backend service.
 * @param formData - The `formData` parameter in the `registerUser` function contains the following
 * data:
 * @returns The `registerUser` function is returning a `Promise` that resolves to an `ActionResponse`.
 * The function first extracts the license data from the form data and saves it to the local storage.
 * Then it extracts user data and user address data from the form data and calls the `submitUserBasics`
 * function with this data. The `submitUserBasics` function likely handles the submission of user
 */
export async function registerUser(formData: UserData & UserAddress & UserLicense): Promise<ActionResponse> {
  //Salvare i dati della patente nella localstorage per poi fargli salvare i dati dentro il service delle patenti
  const licenseData: UserLicense = {
    license_category: formData.license_category,
    license_expiry_date: formData.license_expiry_date,
    license_issue_date: formData.license_issue_date,
    license_number: formData.license_number
  };

  localStorage.setItem("license_dto", JSON.stringify(licenseData));

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
    subscribe_to_newsletter: formData.subscribe_to_newsletter
  };
  const userAddress: UserAddress = {
    cap: formData.cap,
    city: formData.city,
    civic_number: formData.civic_number,
    province: formData.province,
    street: formData.street,
    type: formData.type
  };
  return await submitUserBasics(userData, userAddress);
}



/**
 * This TypeScript function submits user basic information and address details to an authentication API
 * for user registration, handling different response scenarios accordingly.
 * @param {UserData} user - The `user` parameter in the `submitUserBasics` function likely represents
 * data related to a user, such as their name, email, and other personal information. It is of type
 * `UserData`.
 * @param {UserAddress} address - The `address` parameter in the `submitUserBasics` function represents
 * the address details of a user. It typically includes fields such as street address, city, state,
 * postal code, and country. This information is used to register a new user in the system along with
 * their basic user data.
 * @returns The `submitUserBasics` function returns a Promise that resolves to an `ActionResponse`. The
 * possible return values are:
 */
async function submitUserBasics(user: UserData, address: UserAddress): Promise<ActionResponse> {
  const dto: UserRegisterDTO = {
    user: { ...user },
    address: { ...address }
  };
  const response = await authApi.post('/sign-up', dto);

  switch (response.status) {
    case 422:
      return validationErrorResponse(response.data);
    case 409:
      return conflictResponse();
  }

  sessionStorage.setItem("sign-up", "true");
  return { success: true, message: "Request Successfull" };
}

/**
 * The function `validationErrorResponse` takes in data with error messages and formats them into an
 * ActionResponse object for validation errors.
 * @param {any} data - The `data` parameter in the `validationErrorResponse` function is expected to be
 * an object containing a `message` property and an `errors` property, where `errors` is an array of
 * objects. Each object in the `errors` array should have a `field` property and a `message
 * @returns The function `validationErrorResponse` returns a Promise that resolves to an
 * `ActionResponse` object. The `ActionResponse` object has properties `message`, `errors`, and
 * `success`. The `message` property is set to the value of `data["message"]`, the `errors` property is
 * an object containing error messages mapped to their corresponding fields, and the `success` property
 * is set to
 */
async function validationErrorResponse(data: any): Promise<ActionResponse> {
  const returnedValue: ActionResponse = { message: data["message"], errors: {}, success: false };
  data.errors.forEach((err: any) => {
    const newForm: Record<string, string> = {
      [err.field]: err.message
    };

    if (newForm["address"]?.toLowerCase().includes("cap")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        cap: newForm["address"]
      };
    } else if (newForm["address"]?.toLowerCase().includes("città")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        residence_province: newForm["address"]
      };
    } else if (newForm["user"]?.toLowerCase().includes("codice fiscale")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        fiscal_id: newForm["user"]
      };
    } else {
      returnedValue.errors = {
        ...returnedValue.errors,
        ...newForm
      };
    }

  });
  return returnedValue;
}

/**
 * The function `conflictResponse` returns a Promise that resolves to an ActionResponse object with a
 * message "409" and success set to false.
 * @returns The function `conflictResponse` is returning a Promise that resolves to an object with a
 * `message` property set to "409" and a `success` property set to false.
 */
async function conflictResponse(): Promise<ActionResponse> {
  return { message: "409", success: false };
}

