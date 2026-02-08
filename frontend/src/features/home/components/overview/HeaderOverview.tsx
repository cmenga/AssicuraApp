
type HeaderOverviewProps = {
    username: string;
}
export default function HeaderOverview({username }: HeaderOverviewProps) {
    return (
        <div className="bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
                Benvenuto, {username}!
            </h2>
            <p className="text-lg opacity-90 mb-6">
                Ecco un riepilogo delle tue polizze e attività recenti
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                Calcola Nuovo Preventivo
            </button>
        </div>
    );
}