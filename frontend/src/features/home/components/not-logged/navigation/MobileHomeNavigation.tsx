import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export default function MobileNavigation() {
  return (
    <div className="md:hidden py-4 space-y-3 border-t">
      <a
        href="#prodotti"
        className="block text-gray-700 hover:text-blue-600 font-medium"
      >
        Prodotti
      </a>
      <a
        href="#recensioni"
        className="block text-gray-700 hover:text-blue-600 font-medium"
      >
        Recensioni
      </a>
      <a
        href="#contatti"
        className="block text-gray-700 hover:text-blue-600 font-medium"
      >
        Contatti
      </a>
      <Link
        to="/auth/login"
        className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium"
      >
        Area Clienti
      </Link>
    </div>
  );
}

type MobileMenuButtonsProp = {
  isOpen: boolean;
  onOpen: () => void;
};
export function MobileMenuButton(props: MobileMenuButtonsProp) {
  const { isOpen, onOpen } = props;

  return (
    <div className="md:hidden">
      <button onClick={onOpen} className="text-gray-700 hover:text-blue-600">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
