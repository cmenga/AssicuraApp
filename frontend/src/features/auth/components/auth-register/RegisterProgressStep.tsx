import { CheckCircle, FileText, Home, User } from "lucide-react";
import { Fragment } from "react";

const REGISTER_STEPS = [
  { number: 1, title: "Dati Personali", icon: <User className="w-5 h-5" /> },
  {
    number: 2,
    title: "Residenza e Contatti",
    icon: <Home className="w-5 h-5" />,
  },
  {
    number: 3,
    title: "Patente e Account",
    icon: <FileText className="w-5 h-5" />,
  },
];

type RegisterProgressStepProps = {
  current: number;
};

export function RegisterProgressStep(props: RegisterProgressStepProps) {
  const { current } = props;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        {REGISTER_STEPS.map((step, index) => (
          <Fragment key={step.number}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  current > step.number
                    ? "bg-green-500 text-white"
                    : current === step.number
                      ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {current > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`text-sm font-medium text-center hidden sm:block ${
                  current >= step.number ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < REGISTER_STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-all ${
                  current > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
