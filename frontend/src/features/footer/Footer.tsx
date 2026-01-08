import type { ReactNode } from "react";


type FooterProps = {
    children?: ReactNode;
};

export function Footer(props: FooterProps) {
    const { children } = props;
    return (
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div>
                    <h3 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        AssicuraFacile
                    </h3>
                    <p className="text-gray-400">
                        L'assicurazione digitale che fa la differenza
                    </p>
                </div>
                {children}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>&copy; 2026 AssicuraFacile. Tutti i diritti riservati.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Termini e Condizioni</a>
                        <a href="#" className="hover:text-white transition">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}