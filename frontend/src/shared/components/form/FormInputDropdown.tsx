import type { InputProps } from "@/shared/type/form.type";
import type { DropdownOptions } from "@/features/auth/type"; 
import { useState, type InputHTMLAttributes } from "react";


type FormInputDropdownProps = {
    options: DropdownOptions[];
} & InputProps & Omit<InputHTMLAttributes<HTMLSelectElement>, "required" | "value" | "onChange" | "className">;


export function FormInputDropdown(props: FormInputDropdownProps) {
    const { labelName, previous, options, ..._props } = props;
    const [value, setValue] = useState<string|undefined>(previous)

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {labelName} <span className="text-red-500">*</span>
            </label>
            <select
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                {..._props}
            >
                {options.map(({ name, value }) =>
                    <option key={value} value={value}>{name}</option>)}
            </select>
        </div>
    );
}