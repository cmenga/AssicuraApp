import type { InputProps } from "@/shared/type";
import { Mail } from "lucide-react";


type FormInputEmailProps = {
    isRequired?: boolean;
} & InputProps;

export function FormInputEmail(props: FormInputEmailProps) {
    const { previous, isRequired = false, onFormData } = props;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="email"
                    required
                    value={previous}
                    onChange={onFormData}
                    placeholder="mario.rossi@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>
        </div>
    );
}