import type { InputProps } from "@/shared/type";
import type { ReactNode } from "react";

type FormInputCheckboxProps = {
    previous: boolean;
    children?: ReactNode;
} & Omit<InputProps, "previous">;

export function FormInputCheckbox(props: FormInputCheckboxProps) {
    const { onFormData, previous, children } = props;

    return (
        <label className="flex items-center gap-3 group">
            <input
                type="checkbox"
                required
                checked={previous}
                onChange={onFormData}
                className="text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            {children}
        </label>
    );
}