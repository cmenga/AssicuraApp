import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { useRef, type RefObject } from "react";
import DeleteModal from "./DeleteModal";
import { getDaysUntilExpiry } from "@/shared/utils/date";

type DriverLicenseProps = {
  code: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  id: string;
};

export default function DriverLicense(props: DriverLicenseProps) {
  const { code, issueDate, expiryDate, licenseNumber, id } = props;
  const deleteModalRef = useRef<HTMLDialogElement | null>(null);
  const daysLeft = getDaysUntilExpiry(expiryDate);
  const isExpiringSoon = daysLeft < 60;

  function handleOpen(ref: RefObject<HTMLDialogElement | null>) {
    if (ref.current) ref.current.showModal();
  }
  return (
    <div className="min-w-md max-w-md mx-auto relative bg-linear-to-br from-rose-100 to-pink-200 text-slate-800 rounded-2xl shadow-lg p-8 border border-rose-300">
      <div className="absolute top-2 right-4 flex gap-3">
        <Pencil className="w-5 h-5 text-gray-500 cursor-pointer" />
        <Trash2
          className="w-5 h-5 text-red-500 cursor-pointer"
          onClick={() => handleOpen(deleteModalRef)}
        />
      </div>
      <DeleteModal ref={deleteModalRef} id={id} />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold tracking-wide uppercase">
            Patente
          </h2>
          <p className="text-sm text-slate-600">Repubblica Italiana</p>
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

        {isExpiringSoon ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Scade tra {daysLeft} giorni</p>
            </div>
          </div>
        ) : (
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}
            >
              Valida
            </span>
          </div>
        )}

        <div>
          <p className="text-slate-500">Data di emissione</p>
          <p className="font-medium text-slate-900">{issueDate}</p>
        </div>

        <div>
          <p className="text-slate-500">Data di scadenza</p>
          <p className="font-medium text-slate-900">{expiryDate}</p>
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
