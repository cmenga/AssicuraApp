import { Download, Eye, FileText, Filter, Search } from "lucide-react";

const documents = [
  {
    id: 1,
    nome: "Certificato Assicurativo AB123CD",
    tipo: "PDF",
    data: "2025-08-15",
    size: "245 KB",
  },
  {
    id: 2,
    nome: "Carta Verde AB123CD",
    tipo: "PDF",
    data: "2025-08-15",
    size: "180 KB",
  },
  {
    id: 3,
    nome: "Quietanza Pagamento 2026",
    tipo: "PDF",
    data: "2025-08-01",
    size: "120 KB",
  },
  {
    id: 4,
    nome: "Certificato Assicurativo XY789ZW",
    tipo: "PDF",
    data: "2025-11-20",
    size: "240 KB",
  },
  {
    id: 5,
    nome: "Attestato di Rischio",
    tipo: "PDF",
    data: "2025-08-15",
    size: "95 KB",
  },
];

export default function DocumentsDashBoard() {
  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Dimensione
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {doc.nome}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {doc.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(doc.data).toLocaleDateString("it-IT")}
                </td>
                <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              Tutti i tuoi certificati assicurativi, carte verdi e quietanze
              sono archiviati in modo sicuro e disponibili 24/7
            </p>
            <button className="text-blue-600 font-medium text-sm hover:underline">
              Scopri di più sui documenti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
