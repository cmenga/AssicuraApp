import { useState, type InputHTMLAttributes, type ReactNode } from "react";

type FormInputCheckboxProps = {
    children?: ReactNode;
    previous?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChenge" | "className"> ;

export function FormInputCheckbox(props: FormInputCheckboxProps) {
    const { previous, children, ..._props } = props;
    const [value, setValue] = useState<boolean | undefined>(previous)
    
    return (
        <label className="flex items-center gap-3 group">
            <input
                type="checkbox"
                checked={value}
                onChange={(e)=>setValue(e.target.checked)}
                className="text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                {..._props}
            />
            {children}
        </label>
    );
}