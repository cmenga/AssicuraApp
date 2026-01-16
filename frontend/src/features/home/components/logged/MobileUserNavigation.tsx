import { AlertCircle, FileText, Home, Shield } from "lucide-react";
import type { UserNavigationProps } from "../../type";


export function MobileUserNavigation(props: UserNavigationProps) {
    const {activeTab,onActiveTab} = props
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={() => onActiveTab('overview')}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-xs font-medium">Home</span>
                </button>
                <button
                    onClick={() => onActiveTab('policies')}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'policies' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }`}
                >
                    <Shield className="w-6 h-6" />
                    <span className="text-xs font-medium">Polizze</span>
                </button>
                <button
                    onClick={() => onActiveTab('claims')}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'claims' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }`}
                >
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-xs font-medium">Sinistri</span>
                </button>
                <button
                    onClick={() => onActiveTab('documents')}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${activeTab === 'documents' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                        }`}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-medium">Docs</span>
                </button>
            </div>
        </div>
    );
}