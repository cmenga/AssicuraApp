import type { ActionResponse } from "@/shared/type";
import { userApi } from "@/shared/api/user.service";
/**
 * The function `submitContactAction` submits contact form data to a server and returns a response
 * based on the server's status code.
 * @param {FormData} formData - FormData object containing contact information to be submitted.
 * @returns The `submitContactAction` function returns a Promise that resolves to an `ActionResponse`
 * object. The `ActionResponse` object contains a `message` property with a success or error message
 * and a `success` property indicating whether the action was successful or not.
 */
export async function submitContactAction(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await userApi.patch("/update-contact", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  switch (response.status) {
    case 404:
      return { message: response.data.detail, success: false };
    case 422:
      return validationActionResponse(response.data);
  }
  return { message: "Successfull request", success: true };
}


export async function submitAddressACtion(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await userApi.put("/update-address", data);

  switch (response.status) {
    case 404:
      return { message: response.data.detail, success: false };
    case 422:
      return validationActionResponse(response.data);
  }
  return { message: "Successfull request", success: true };
}

export async function submitPasswordAction(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await userApi.patch("/change-password", data);

  switch (response.status) {
    case 403:
      return { message: response.data.detail, success: false };
    case 404:
      return { message: response.data.detail, success: false };
    case 422:
      return validationActionResponse(response.data);
  }
  return { message: "Password cambiata con successo", success: true };
}
/**
 * The function `validationActionResponse` processes data to create an `ActionResponse` object with
 * messages, errors, and success status.
 * @param {any} data - The `data` parameter in the `validationActionResponse` function seems to be an
 * object containing a `message` property and an `errors` array. The function creates an
 * `ActionResponse` object with properties for `message`, `errors`, and `success`, where `errors` is an
 * object
 * @returns The function `validationActionResponse` returns an object of type `ActionResponse` with the
 * following properties:
 * - `message` taken from the input data
 * - `errors` containing a key-value pair of error messages
 * - `success` set to `false`
 */
async function validationActionResponse(data: any) {
  const returnedValue: ActionResponse = {
    message: data["message"],
    errors: {},
    success: false,
  };
  data.errors.forEach((err: any) => {
    const newForm: Record<string, string> = {
      [err.field]: err.message,
    };
    if (newForm["body"]?.toLowerCase().includes("cap")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        cap: newForm["body"],
      };
    } else if (newForm["body"]?.toLowerCase().includes("città")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        residence_province: newForm["body"],
      };

    } else if (newForm["body"]?.toLowerCase().includes("password")) {
      returnedValue.errors = {
        ...returnedValue.errors,
        change_password: newForm["body"],
      };
    } else {
      returnedValue.errors = {
        ...returnedValue.errors,
        ...newForm
      };
    };
  });
  return returnedValue;
}


export async function deleteUser(): Promise<ActionResponse> {
  const response = await userApi.delete("/delete");

  if (response.status == 200) {
    localStorage.clear();
    sessionStorage.clear();
    return { success: true, message: response.data.message };

  }
  return { success: false, message: response.data.message };

}