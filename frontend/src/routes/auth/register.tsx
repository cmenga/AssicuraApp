import { RegisterForm } from '@/components/auth-register/RegisterForm';
import { RegisterHeader } from '@/components/auth-register/RegisterHeader';
import { RegisterProgressStep } from '@/components/auth-register/RegisterProgressStep';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(1);

  function handlePrevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }
  return (
    <div className="max-w-4xl mx-auto">
      <RegisterHeader />
      <RegisterProgressStep current={currentStep} />
      <div className="bg-white rounded-3xl min-w-4xl shadow-2xl p-8 md:p-10">
        <RegisterForm
          currentStep={currentStep}
          onCurrentStep={setCurrentStep}
          onPrevStep={handlePrevStep}
        />
        <div className="mt-8 text-center pt-6 border-t border-gray-200">
          <Link to="/auth/login" className="text-gray-600 hover:text-blue-700 font-semibold hover:underline">
            Hai già un account?
          </Link>
        </div>
      </div>
    </div>

  );
}
