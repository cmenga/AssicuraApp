import { Filter, Search } from "lucide-react";
import { memo } from "react";

export const HeaderDocuments = memo(() => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">I Tuoi Documenti</h2>
        <p className="text-gray-600 mt-1">
          Scarica certificati, carte verdi e quietanze
        </p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Search className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Cerca</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Filtri</span>
        </button>
      </div>
    </div>
  );
});
