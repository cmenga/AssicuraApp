import { Modal } from "@/shared/components/Modal";
import { useRef } from "react";
import FormNewContract from "./policies/FormContract";

type HeaderOverviewProps = {
  username: string;
};

export default function HeaderOverview({ username }: HeaderOverviewProps) {
  const modal = useRef<HTMLDialogElement | null>(null);

  function handleOpen() {
    const current = modal.current;
    if (current) current.showModal();
  }
  function handleClose() {
    const current = modal.current;
    if (current) current.close();
  }

  return (
    <div className="bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-2">Benvenuto, {username}!</h2>
      <p className="text-lg opacity-90 mb-6">
        Ecco un riepilogo delle tue polizze e attività recenti
      </p>
      <button onClick={handleOpen} className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
        Calcola Nuovo Preventivo
      </button>
      <Modal ref={modal}>
        <FormNewContract onClose={handleClose}/>
      </Modal>
    </div>
  );
}
