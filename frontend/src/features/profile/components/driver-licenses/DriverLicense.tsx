import { AlertCircle } from "lucide-react";


type DriverLicenseProps = {
    code: string;
    licenseNumber: string;
    issueDate: string;
    expiryDate: string;
};

const getDaysUntilExpiry = (expiry: any) => {
    const today: Date = new Date();
    const expiryDate: Date = new Date(expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export default function DriverLicense(props: DriverLicenseProps) {
    const { code, issueDate, expiryDate, licenseNumber } = props;
    const daysLeft = getDaysUntilExpiry(expiryDate);
    console.log(daysLeft);
    const isExpiringSoon = daysLeft < 90;

    return (
        <div className="min-w-md max-w-md mx-auto bg-linear-to-br from-rose-100 to-pink-200 text-slate-800 rounded-2xl shadow-lg p-6 border border-rose-300">

            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-semibold tracking-wide uppercase">
                        Patente
                    </h2>
                    <p className="text-sm text-slate-600">
                        Repubblica Italiana
                    </p>
                </div>

                <div className="text-right">
                    <span className="text-xs uppercase text-slate-500">Tipo</span>
                    <p className="text-2xl font-bold text-slate-900">{code}</p>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-slate-500">Numero patente</p>
                    <p className="font-medium tracking-wide text-slate-900">
                        {licenseNumber}
                    </p>
                </div>

                {isExpiringSoon ? <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-orange-800">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">
                            Scade tra {daysLeft} giorni
                        </p>
                    </div>
                </div> : <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}
                    >
                        Valida
                    </span>
                </div>}

                <div>
                    <p className="text-slate-500">Data di emissione</p>
                    <p className="font-medium text-slate-900">
                        {issueDate}
                    </p>
                </div>

                <div>
                    <p className="text-slate-500">Data di scadenza</p>
                    <p className="font-medium text-slate-900">
                        {expiryDate}
                    </p>
                </div>
            </div>


            <div className="mt-6 flex items-center justify-between border-t border-rose-300 pt-4">
                <p className="text-xs text-slate-600">
                    Valido solo all'interno dell'Unione Europea
                </p>
                <span className="text-xs font-semibold tracking-widest text-slate-700">
                    EU · IT
                </span>
            </div>
        </div>
    );
}