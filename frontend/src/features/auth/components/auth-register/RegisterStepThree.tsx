import { FileText } from "lucide-react";

import FormHeader from "./FormHeader";
import FormInputText from "@/shared/components/form/FormInputText";
import FormInputDropdown from "@/shared/components/form/FormInputDropdown";
import FormInputDate from "@/shared/components/form/FormInputDate";
import FormInputPassword from "@/shared/components/form/FormInputPassword";
import FormInputCheckbox from "@/shared/components/form/FormInputCheckbox";
import ErrorMessage from "@/shared/components/form//ErrorMessage";

import type { DropdownOptions } from "../../type";
import {
  handleDrivingLicenseKeyPress,
} from "../../utils";

import { handlePasswordKeyPress } from "@/shared/utils/onKeyDown";

const LICENSE_OPTIONS: DropdownOptions[] = [
  { value: "A", name: "A - Moto" },
  { value: "B", name: "B - Auto" },
  { value: "C", name: "C - Veicoli commerciali" },
];

type RegisterStepTrheeProps = {
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseCategory: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
  subscribeToNewsletter: boolean;
  errors?: Record<string, string>;
};

export default function RegisterStepThree(props: RegisterStepTrheeProps) {
  const {
    licenseCategory,
    licenseExpiryDate,
    licenseIssueDate,
    licenseNumber,
    password,
    confirmPassword,
    acceptPrivacyPolicy,
    acceptTerms,
    subscribeToNewsletter,
    errors,
  } = props;

  return (
    <div className="space-y-6">
      <FormHeader
        title="Patente e Account"
        description="Ultimi dettagli per completare la registrazione"
      />
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Info:</strong> I dati della patente sono necessari per
          calcolare il preventivo assicurativo più accurato
        </p>
      </div>

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

      <FormInputDropdown
        labelName="Categoria Patente"
        options={LICENSE_OPTIONS}
        previous={licenseCategory}
        name="license_category"
      >
        {errors?.license_category && (
          <ErrorMessage message={errors.license_category} />
        )}
      </FormInputDropdown>

      <div className="grid md:grid-cols-2 gap-6">
        <FormInputDate
          labelName="Data Rialscio"
          previous={licenseIssueDate}
          name="license_issue_date"
        >
          {errors?.license_issue_date && (
            <ErrorMessage message={errors.license_issue_date} />
          )}
        </FormInputDate>
        <FormInputDate
          labelName="Date Scadenza"
          previous={licenseExpiryDate}
          name="license_expiry_date"
        >
          {errors?.license_expiry_date && (
            <ErrorMessage message={errors.license_expiry_date} />
          )}
        </FormInputDate>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Crea la tua Password
        </h3>
        <FormInputPassword
          labelName="Password"
          isRequired
          placeholder="••••••••"
          minLength={8}
          autoComplete="new-password"
          previous={password}
          name="password"
          onKeyDown={handlePasswordKeyPress}
        >
          {errors?.password && <ErrorMessage message={errors.password} />}
        </FormInputPassword>
        <FormInputPassword
          labelName="Conferma Password"
          isRequired
          placeholder="Ripeti la password"
          minLength={8}
          previous={confirmPassword}
          name="confirm_password"
          onKeyDown={handlePasswordKeyPress}
        >
          {errors?.confirm_password && (
            <ErrorMessage message={errors.confirm_password} />
          )}
        </FormInputPassword>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-200">
        <FormInputCheckbox required previous={acceptTerms} name="accept_terms">
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            Accetto i{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Termini e Condizioni
            </a>{" "}
            <span className="text-red-500">*</span>
          </span>
        </FormInputCheckbox>

        <FormInputCheckbox
          required
          previous={acceptPrivacyPolicy}
          name="accept_privacy_policy"
        >
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            Ho letto e accetto l'{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Informativa sulla Privacy
            </a>{" "}
            <span className="text-red-500">*</span>
          </span>
        </FormInputCheckbox>

        <FormInputCheckbox
          previous={subscribeToNewsletter}
          name="subscrive_to_newsletter"
        >
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            Desidero ricevere offerte esclusive e aggiornamenti via email
          </span>
        </FormInputCheckbox>
      </div>
    </div>
  );
}
