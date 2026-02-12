
import { Shield } from 'lucide-react';

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
     
                <div className="mb-8 animate-pulse">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full mb-4">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                </div>


                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8">
                    AssicuraFacile
                </h1>


                <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>


                <p className="text-gray-600 mt-6 text-sm">Caricamento in corso...</p>
            </div>
        </div>
    );
}