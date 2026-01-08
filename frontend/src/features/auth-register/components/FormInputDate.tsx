import type { InputProps } from "@/shared/type";
import { Calendar } from "lucide-react";


type DateProps = {
    label: string
} & InputProps;

export function FormInputDate(props: DateProps) {
    const { onFormData, previous, label } = props;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="date"
                    required
                    value={previous}
                    onChange={onFormData}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>
        </div>
    );
}