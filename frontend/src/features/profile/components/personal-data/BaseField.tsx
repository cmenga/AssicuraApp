

type BaseFieldProps = {
    label: string;
    field: string | number;
};
export default function BaseField({ label, field }: BaseFieldProps) {
    return (
        <div>
            <label className="first-letter:uppercase block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <p className="text-gray-900 font-medium py-3 bg-gray-50 px-4 rounded-xl">{field}</p>
        </div>
    );
}