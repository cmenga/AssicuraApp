export function CTAButtons() {
    return (<section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
                Pronto a Risparmiare sulla Tua Assicurazione?
            </h2>
            <p className="text-xl mb-8 opacity-95">
                Ottieni un preventivo gratuito in meno di 2 minuti
            </p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:-translate-y-1">
                Calcola il Tuo Preventivo
            </button>
            <p className="mt-6 text-sm opacity-90">
                Nessun obbligo di acquisto • Confronto trasparente • Attivazione immediata
            </p>
        </div>
    </section>);
}