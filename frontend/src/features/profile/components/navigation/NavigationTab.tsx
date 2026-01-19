
type NavigationTabProps = {
    onActiveSection: (tab: "personali" | "patenti") => void;
    activeSection: string;
};
export default function NavigationTab({activeSection,onActiveSection}:NavigationTabProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-2 mb-8">
            <div className="flex gap-2">
                <button
                    onClick={() => onActiveSection('personali')}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition ${activeSection === 'personali'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Dati Personali
                </button>
                <button
                    onClick={() => onActiveSection('patenti')}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition ${activeSection === 'patenti'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Patenti
                </button>
            </div>
        </div>
    );
}