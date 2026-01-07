import type { InputProps } from "@/shared/type";
import { Mail } from "lucide-react";

export function Email(props: InputProps) {
    const { previous, onFormData} = props;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
            </label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="email"
                    required
                    value={previous}
                    onChange={onFormData}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>
        </div>
    );
}