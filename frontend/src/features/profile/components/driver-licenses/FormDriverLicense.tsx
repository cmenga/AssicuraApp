import { driverLicenseApi } from "@/shared/api/http";
import FormHeader from "@/shared/components/form/FormHeader";
import FormInputDate from "@/shared/components/form/FormInputDate";
import FormInputDropdown from "@/shared/components/form/FormInputDropdown";
import FormInputText from "@/shared/components/form/FormInputText";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import type {
  ActionResponse,
  DropdownOptions,
} from "@/shared/type";
import { handleDrivingLicenseKeyPress } from "@/shared/utils/onKeyDown";
import { CheckCircle, FileText, X } from "lucide-react";
import { updateDriverLicense } from "../../utils";

const LICENSE_OPTIONS: DropdownOptions[] = [
  { value: "A", name: "A - Moto" },
  { value: "B", name: "B - Auto" },
  { value: "C", name: "C - Veicoli commerciali" },
];

type FromDriverLicenseProps = {
  dateOfBirth: string;
  onClose: () => void;
};

export default function FromDriverLicense({
  dateOfBirth,
  onClose,
}: FromDriverLicenseProps) {
  const { errors, cleanErrors, isPending, submitAction } = useFormStateAction(
    action,
    {
      onSuccess: async () => {
        cleanErrors();
        await updateDriverLicense();
        onClose();
      },
    },
  );

  return (
    <form onSubmit={submitAction} className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <FormHeader title="Patente" description="Dettagli della patente" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Info:</strong> I dati della patente sono necessari per
            calcolare il preventivo assicurativo più accurato
          </p>
        </div>
        {errors?.body && <ErrorMessage message={errors.body} />}
        <FormInputText
          labelName="Numero Patente"
          icon={FileText}
          placeholder="U1ABC1234567"
          previous=""
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

        <FormInputDropdown
          labelName="Categoria Patente"
          options={LICENSE_OPTIONS}
          name="license_code"
        >
          {errors?.license_code && (
            <ErrorMessage message={errors.license_code} />
          )}
        </FormInputDropdown>

        <div className="grid md:grid-cols-2 gap-6">
          <FormInputDate labelName="Data Rialscio" name="issue_date">
            {errors?.issue_date && <ErrorMessage message={errors.issue_date} />}
          </FormInputDate>
          <FormInputDate labelName="Date Scadenza" name="expiry_date">
            {errors?.expiry_date && (
              <ErrorMessage message={errors.expiry_date} />
            )}
          </FormInputDate>
        </div>
        <input
          className="hidden"
          value={dateOfBirth}
          onChange={(e) => {
            return e.preventDefault();
          }}
          name="date_of_birth"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            type="reset"
            className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-gray-100 to-gray-200 text-balck py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <X className="h-5 w-5" />
            Chiudi
          </button>
          <button
            type="submit"
            className="cursor-pointer flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle className="w-5 h-5" />
            {isPending ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </form>
  );
}

async function action(
  formData: FormData,
): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await driverLicenseApi.post("/add", data);
  switch (response.status) {
    case 422:
      let errors = {};
      response.data.errors.forEach((err: Record<string, string>) => {
        errors = {
          ...errors,
          [err.field]: err.message,
        };
      });
      return { errors: errors, success: false };
    case 409:
      return { errors: { body: response.data.detail }, success: false };
  }
  return { success: true };
}


