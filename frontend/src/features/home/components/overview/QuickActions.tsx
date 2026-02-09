import { Download, Plus } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h3>
      <div className="grid gap-4">
        <button className="cursor-pointer flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Nuova Polizza</p>
            <p className="text-sm text-gray-600">Calcola preventivo</p>
          </div>
        </button>

        <button className="cursor-pointer flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition">
          <div className="bg-green-100 p-3 rounded-lg">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Scarica Documenti</p>
            <p className="text-sm text-gray-600">Certificati e carte</p>
          </div>
        </button>
      </div>
    </div>
  );
}
