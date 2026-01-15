import { useState } from "react";
import type { InputProps } from "@/shared/type/form.type";


type FormInputGenderProps = {name?: string} & InputProps;

export function FormInputGender(props: FormInputGenderProps) {
    const { labelName, previous, name } = props;
    const [value, setValue] = useState<string | undefined>(previous);
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                {labelName} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setValue("male")}
                    className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${value === 'male'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                >
                    Maschio
                </button>
                <button
                    type="button"
                    onClick={() => setValue('female')}
                    className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${value === 'female'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                >
                    Femmina
                </button>
            </div>
            <input type="text" value={value} className="hidden" name={name} onChange={(e) => {e}} />
        </div>
    );
}