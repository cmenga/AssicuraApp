import { Link } from "@tanstack/react-router";

export default function HomeNavigation() {
  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-default">
              AssicuraFacile
            </h1>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
            >
              Area Clienti
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
