import { CreditCard } from "lucide-react";

import DriverLicense from "./DriverLicense";
import type { DriverLicenseModel } from "@/shared/type";
import { useStoreKey } from "@/shared/hooks/useStoreKey";
import InfoBox from "./InfoBox";
import { Modal } from "@/shared/components/Modal";
import FromDriverLicense from "./FormDriverLicense";
import { useRef } from "react";

const requiredCodes = ["A", "B", "C"];

export default function DriverLicenses({
  dateOfBirth,
}: {
  dateOfBirth: string;
}) {
  const licenses = useStoreKey<DriverLicenseModel[]>("driver-license");
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const hasAllLicenses = requiredCodes.every((code) =>
    licenses?.some((l) => l.code === code),
  );

  function handleOpen() {
    if (modalRef.current) modalRef.current.showModal();
  }
  function handleClose() {
    if (modalRef.current) modalRef.current.close();
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Visualizza tutte le tue patenti registrate
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {licenses &&
          licenses.map((license, index) => {
            return (
              <DriverLicense
                key={index}
                id={license.id}
                code={license.code}
                expiryDate={license.expiry_date}
                issueDate={license.issue_date}
                licenseNumber={license.number}
              />
            );
          })}
      </div>
      {!hasAllLicenses && (
        <div
          onClick={handleOpen}
          className="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer"
        >
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Aggiungi Nuova Patente
          </h3>
          <p className="text-gray-600 mb-4">
            Registra un'altra patente al tuo profilo
          </p>
          <button
            onClick={handleOpen}
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Aggiungi Patente
          </button>
        </div>
      )}

      <Modal ref={modalRef}>
        <FromDriverLicense dateOfBirth={dateOfBirth} onClose={handleClose} />
      </Modal>

      <InfoBox />
    </div>
  );
}
