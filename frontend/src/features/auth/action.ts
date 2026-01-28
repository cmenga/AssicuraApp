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
 * The function `registerUser` saves user data and license data in local storage and then submits user
 * basics to a backend service.
 * @param formData - The `formData` parameter in the `registerUser` function contains the following
 * data:
 * @returns The `registerUser` function is returning a `Promise` that resolves to an `ActionResponse`.
 * The function first extracts the license data from the form data and saves it to the local storage.
 * Then it extracts user data and user address data from the form data and calls the `submitUserBasics`
 * function with this data. The `submitUserBasics` function likely handles the submission of user
 */
export async function registerUser(
  formData: UserData & UserAddress & UserLicense,
): Promise<ActionResponse> {
  //Salvare i dati della patente nella localstorage per poi fargli salvare i dati dentro il service delle patenti
  const licenseData: UserLicense = {
    license_category: formData.license_category,
    license_expiry_date: formData.license_expiry_date,
    license_issue_date: formData.license_issue_date,
    license_number: formData.license_number,
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
  return await submitUserBasics(userData, userAddress);
}


async function submitUserBasics(
  user: UserData,
  address: UserAddress,
): Promise<ActionResponse> {
  const dto: UserRegisterDTO = {
    user: { ...user },
    address: { ...address },
  };
  const response = await authApi.post("/sign-up", dto);

  switch (response.status) {
    case 422:
      return validationErrorResponse(response.data);
    case 409:
      return conflictResponse(response.data);
  }

  store.set<boolean>("sign-up", true);
  return { success: true, message: "Request Successfull" };
}


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
    } else {
      returnedValue.errors = {
        ...returnedValue.errors,
        ...newForm,
      };
    }
  });
  return returnedValue;
}

async function conflictResponse(data: any): Promise<ActionResponse> {
  return {
    message: "409",
    success: false,
    errors: { existing_user: data.detail },
  };
}


export async function submitUserLogin(
  formData: FormData
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
