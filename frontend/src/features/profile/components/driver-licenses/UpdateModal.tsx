import type { RefObject } from "react";
import { X, Check, FileText } from "lucide-react";

import FormInputDate from "@/shared/components/form/FormInputDate";
import FormInputText from "@/shared/components/form/FormInputText";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { Modal } from "@/shared/components/Modal";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import type { ActionResponse } from "@/shared/type";
import { handleDrivingLicenseKeyPress } from "@/shared/utils/onKeyDown";
import { driverLicenseApi } from "@/shared/api/http";
import { updateDriverLicense } from "../../utils";



type UpdateModalProps = {
  ref: RefObject<HTMLDialogElement | null>;
  id: string;
  licenseCode: string;
  issueDate: string;
  expiryDate: string;
  licenseNumber: string;
  dateOfBirth: string;
};
export default function UpdateModal(props: UpdateModalProps) {
  const { expiryDate, id, issueDate, licenseCode, licenseNumber, ref, dateOfBirth } = props;
  const { errors, cleanErrors, submitAction } = useFormStateAction(action, {
    onSuccess: async () => { cleanErrors(); await updateDriverLicense(); handleClose()}
  });
  function handleClose() {
    if (ref.current)
      ref.current.close();
  }


  return (
    <Modal ref={ref}>
      <form onSubmit={submitAction} className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <input type="text" className="hidden" name="id" value={id} readOnly/>
          <input type="text" className="hidden" name="license_code" value={licenseCode} readOnly />
          <input type="text" className="hidden" name="date_of_birth" value={dateOfBirth} readOnly/>
          {errors?.body && <ErrorMessage message={errors.body} />}
          <FormInputText
            labelName="Numero Patente"
            icon={FileText}
            placeholder="U1ABC1234567"
            previous={licenseNumber}
            name="license_number"
            minLength={8}
            maxLength={10}
            onKeyDown={handleDrivingLicenseKeyPress}
            style={{ textTransform: "uppercase" }}
          >
            {errors?.license_number && (
              <ErrorMessage message={errors.license_number} />
            )}
          </FormInputText>


          <div className="grid md:grid-cols-2 gap-6">
            <FormInputDate
              labelName="Data Rialscio"
              previous={issueDate}
              name="issue_date"
            >
              {errors?.issue_date && (
                <ErrorMessage message={errors.issue_date} />
              )}
            </FormInputDate>
            <FormInputDate
              labelName="Date Scadenza"
              previous={expiryDate}
              name="expiry_date"
            >
              {errors?.expiry_date && (
                <ErrorMessage message={errors.expiry_date} />
              )}
            </FormInputDate>
          </div>
          <footer className="flex gap-6">
            <button
              onClick={handleClose}
              type="reset"
              className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-gray-100 to-gray-200 text-balck py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <X className="h-5 w-5" />
              Chiudi
            </button>
            <button
              type="submit"
              className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Check className="w-5 h-5" />
              Conferma
            </button>
          </footer>
        </div>
      </form>
    </Modal>
  );
}

async function action(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const licenseId = data.id;
  const mergedData = {
    license_code: data.license_code,
    license_number: data.license_number,
    expiry_date: data.expiry_date,
    issue_date: data.issue_date,
    date_of_birth: data.date_of_birth
  };

  const response = await driverLicenseApi.patch(`/update/${licenseId}`, mergedData);
  switch (response.status) {
    case 422:
      const returnedValue: ActionResponse = { success: false, errors: {} }
      response.data.errors.forEach((err: Record<string, string>) => {
        returnedValue.errors = {
          ...returnedValue.errors,
          [err.field]: err.message
        }
      })
      return returnedValue 
    case 404:
      return {success: false, errors:{body: "Non è possibile aggiornare il dato in questo momento"}}
  }
  return { success: true };
}