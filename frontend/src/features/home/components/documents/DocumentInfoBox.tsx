import { FileText } from "lucide-react";
import { memo } from "react";

export const DocumentInfoBox = memo(() => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Documenti sempre disponibili
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Tutti i tuoi certificati assicurativi, carte verdi e quietanze sono
            archiviati in modo sicuro e disponibili 24/7
          </p>
          <button className="text-blue-600 font-medium text-sm hover:underline">
            Scopri di più sui documenti
          </button>
        </div>
      </div>
    </div>
  );
});
