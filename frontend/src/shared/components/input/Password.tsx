import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";


export type PasswordProps = {
    onFormData: (event: ChangeEvent<HTMLInputElement>) => void;
    previous: string
};

export function Password(props: PasswordProps) {
    const {onFormData, previous } = props;
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
            </label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={previous}
                    onChange={onFormData}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}