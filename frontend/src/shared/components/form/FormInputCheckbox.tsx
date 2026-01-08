import type { InputProps } from "@/shared/type";
import type { ReactNode } from "react";

type FormInputCheckboxProps = {
    previous: boolean;
    children?: ReactNode;
} & Omit<InputProps, "previous">;

export function FormInputCheckbox(props: FormInputCheckboxProps) {
    const { onFormData, previous, children } = props;

    return (
        <label className="flex items-start gap-3 cursor-pointer group">
            <input
                type="checkbox"
                required
                checked={previous}
                onChange={onFormData}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            {children}
        </label>
    );
}