import { Link } from "@tanstack/react-router";
import { Home, ArrowBigLeft } from "lucide-react";

export default function ProfileNavigation() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/home" className="text-gray-600 hover:text-gray-900">
              <Home className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Il Mio Profilo
            </h1>
          </div>
          <Link
            to="/home"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            <ArrowBigLeft className="w-5 h-5" />
            Torna indietro
          </Link>
        </div>
      </div>
    </header>
  );
}
