import { useState, type ComponentType, type InputHTMLAttributes, type ReactNode } from "react";


type TextProps = {
    icon?: ComponentType<{ className?: string; }>;
    labelName: string;
    children?: ReactNode;
    previous?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "required" | "value" | "className" | "onChange">;

export function FormInputText(props: TextProps) {
    const { icon, children, labelName,previous, ..._props } = props;
    const IconComponent = icon;

    const [value, setValue] = useState<string | undefined>(previous)

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {labelName} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                {IconComponent && <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
                <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    {..._props}
                />
            </div>
            {children}
        </div>
    );
}