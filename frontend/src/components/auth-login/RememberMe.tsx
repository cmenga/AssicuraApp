import type { ChangeEvent } from "react";

type RememberMeProps = {
    previous: boolean
    onFormData: (e: ChangeEvent<HTMLInputElement>) => void
};

export function RememberMe(props: RememberMeProps) {
    const { onFormData, previous } = props;
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={previous}
                onChange={onFormData}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Ricordami</span>
        </label>
    );
}