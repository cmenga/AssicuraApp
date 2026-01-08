import { memo } from "react";

export const RegisterHeader = memo(function Header() {
    console.log("Loading first header")
    return (
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
                AssicuraFacile
            </h1>
            <p className="text-xl text-gray-600">Crea il tuo account in 3 semplici passaggi</p>
        </div>
    );
});