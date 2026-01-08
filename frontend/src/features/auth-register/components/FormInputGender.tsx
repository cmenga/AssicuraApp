import type { InputProps } from "@/shared/type";


type FormInputGenderProps = {
    onFormData: (field: string, value: string) => void;
} & Omit<InputProps, "onFormData">;

export function FormInputGender(props: FormInputGenderProps) {
    const {previous, onFormData } = props;
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Sesso <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onFormData("sesso", "M")}
                    className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${previous === 'M'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                >
                    Maschio
                </button>
                <button
                    type="button"
                    onClick={() => onFormData('sesso', 'F')}
                    className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${previous === 'F'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                >
                    Femmina
                </button>
            </div>
        </div>
    );
}