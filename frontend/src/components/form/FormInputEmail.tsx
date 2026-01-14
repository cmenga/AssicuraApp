import type { InputProps } from "@/type/form.type";
import { Mail } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";


type FormInputEmailProps = {
    isRequired?: boolean;
} & Omit<InputProps, "labelName"> & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "required" | "value" | "onChange" | "className">;

export function FormInputEmail(props: FormInputEmailProps) {
    const { previous, isRequired = false, ..._props } = props;    
    const [value, setValue] = useState<string | undefined>(previous)

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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    {..._props}
                />
            </div>
        </div>
    );
}