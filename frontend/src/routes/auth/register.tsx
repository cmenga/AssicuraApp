import { RegisterForm } from '@/features/auth-register/RegisterForm';
import { RegisterHeader } from '@/features/auth-register/RegisterHeader';
import { RegisterProgressStep } from '@/features/auth-register/RegisterProgressStep';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <RegisterHeader />
      <RegisterProgressStep current={currentStep} />
      {/* Bisogna aggiungere il form */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <RegisterForm
          currentStep={currentStep}
          onCurrentStep={setCurrentStep}
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
