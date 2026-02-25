import { Modal } from "@/shared/components/Modal";
import { Plus } from "lucide-react";
import FormContract from "./policies/FormContract";
import { useRef } from "react";

export default function QuickActions() {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  function handleOpen() {
    const current = modalRef.current;
    if (current) current.showModal();
  }

  function handleClose() {
    const current = modalRef.current;
    if (current) current.close(); 
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h3>
      <div  className="grid gap-4">
        <button onClick={handleOpen} className="cursor-pointer flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Nuova Polizza</p>
            <p className="text-sm text-gray-600">Calcola preventivo</p>
          </div>
        </button>

        <Modal ref={modalRef}>
          <FormContract onClose={handleClose} />
        </Modal>
      </div>
    </div>
  );
}
