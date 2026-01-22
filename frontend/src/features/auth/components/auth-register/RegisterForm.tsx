import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";
import RegisterStepThree from "./RegisterStepThree";
import ErrorMessage from "@/shared/components/form/ErrorMessage";

import type { UserRegisterForm } from "../../type";
import type { ActionResponse } from "@/shared/type";
import { registerUser } from "../../action";

const FORM_STATE_INIT: UserRegisterForm = {
  first_name: "",
  last_name: "",
  place_of_birth: "",
  date_of_birth: "",
  fiscal_id: "",
  gender: "",
  email: "",
  phone_number: "",
  password: "",
  confirm_password: "",
  license_category: "A",
  license_expiry_date: "",
  license_issue_date: "",
  license_number: "",
  accept_terms: true,
  accept_privacy_policy: true,
  subscribe_to_newsletter: false,
  cap: "",
  city: "",
  civic_number: "",
  province: "",
  street: "",
  type: "residence",
};

type RegisterFormProps = {
  currentStep: number;
  onCurrentStep: (current: number) => void;
  onPrevStep: () => void;
};

export default function RegisterForm(props: RegisterFormProps) {
  const { currentStep, onCurrentStep, onPrevStep } = props;
  const navigate = useNavigate();
  const [state, setState] = useState<UserRegisterForm>(FORM_STATE_INIT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const mergedData = { ...state, ...data };
    setState(mergedData);

    if (currentStep < 3) {
      onCurrentStep(currentStep + 1);
      return;
    }

    const response: ActionResponse = await registerUser(mergedData);
    if (response.success) {
      setErrors({});
      navigate({ to: "/auth/login" });
    }
    onCurrentStep(1);
    response.errors && setErrors(response.errors);
  }

  function saveData() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    const mergedData = { ...state, ...data };
    setState(mergedData);
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {errors?.existing_user && <ErrorMessage message={errors.existing_user} />}
      {currentStep === 1 && (
        <RegisterStepOne
          firstName={state.first_name}
          lastName={state.last_name}
          placeOfBirth={state.place_of_birth}
          dateOfBirth={state.date_of_birth}
          fiscalId={state.fiscal_id}
          gender={state.gender}
          errors={errors}
        />
      )}
      {currentStep === 2 && (
        <RegisterStepTwo
          cap={state.cap}
          city={state.city}
          civicNumber={state.civic_number}
          email={state.email}
          phoneNumber={state.phone_number}
          province={state.province}
          street={state.street}
          errors={errors}
        />
      )}

      {currentStep === 3 && (
        <RegisterStepThree
          acceptPrivacyPolicy={state.accept_privacy_policy}
          acceptTerms={state.accept_terms}
          confirmPassword={state.confirm_password}
          licenseCategory={state.license_category}
          licenseExpiryDate={state.license_expiry_date}
          licenseIssueDate={state.license_issue_date}
          licenseNumber={state.license_number}
          subscribeToNewsletter={state.subscribe_to_newsletter}
          password={state.password}
          errors={errors}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => {
              saveData();
              onPrevStep();
            }}
            className="flex items-center justify-center gap-2 flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          {currentStep < 3 ? (
            <>
              Continua
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Completa Registrazione
            </>
          )}
        </button>
      </div>
    </form>
  );
}
