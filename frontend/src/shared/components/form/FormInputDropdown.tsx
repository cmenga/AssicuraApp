import type { InputProps } from "@/shared/type";
import type { ChangeEvent } from "react";

export interface DropdownOptions {
    value: string;
    name: string;
};

type FormInputDropdownProps = {
    label: string;
    onFormData: (event: ChangeEvent<HTMLSelectElement>) => void;
    options: DropdownOptions[];
} & Omit<InputProps, "onFormData">;


export function FormInputDropdown(props: FormInputDropdownProps) {
    const { onFormData, previous, options, label } = props;
    const content = options.map(({ name, value }) =>
        <option key={value} value={value}>{name}</option>);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <select
                required
                value={previous}
                onChange={onFormData}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
                {content}
            </select>
        </div>
    );
}