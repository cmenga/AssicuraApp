import type { InputProps } from "@/shared/type";
import type { ComponentType, ReactNode } from "react";


type TextProps = {
    icon?: ComponentType<{ className?: string; }>;
    placeholder?: string;
    label: string;
    children?: ReactNode;
    pattern?: string;
    maxLength?: number;
} & InputProps;

export function FormInputText(props: TextProps) {
    const { onFormData, previous, icon, placeholder, label, children, pattern, maxLength } = props;
    const IconComponent = icon;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                {IconComponent && <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
                <input
                    type="text"
                    required
                    value={previous}
                    onChange={onFormData}
                    placeholder={placeholder}
                    pattern={pattern}
                    maxLength={maxLength}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>
            {children}
        </div>
    );
}