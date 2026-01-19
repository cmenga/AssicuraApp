import { Shield } from "lucide-react";


export default function SecurityInfo() {

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
            <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-1">I tuoi dati sono al sicuro</h4>
                    <p className="text-sm text-gray-600">
                        Tutte le informazioni sono protette con crittografia di livello bancario e non verranno mai condivise con terze parti.
                    </p>
                </div>
            </div>
        </div>
    );
}