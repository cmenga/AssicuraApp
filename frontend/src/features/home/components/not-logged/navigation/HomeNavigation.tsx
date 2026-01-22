import { useState } from "react";
import { Link } from "@tanstack/react-router";
import MobileNavigation, { MobileMenuButton } from "./MobileHomeNavigation";

export default function HomeNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMenuOpen() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-default">
              AssicuraFacile
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#prodotti"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Prodotti
            </a>
            <a
              href="#recensioni"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Recensioni
            </a>
            <a
              href="#contatti"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Contatti
            </a>
            <Link
              to="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
            >
              Area Clienti
            </Link>
          </div>

          <MobileMenuButton isOpen={mobileMenuOpen} onOpen={toggleMenuOpen} />
        </div>

        {mobileMenuOpen && <MobileNavigation />}
      </nav>
    </header>
  );
}
