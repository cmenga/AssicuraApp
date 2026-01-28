import type { ActionResponse, UserModel } from "@/shared/type";
import { Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNotification } from "@/shared/hooks/useNotification";
import { userApi } from "@/shared/api/http";

type ProfileHeaderProps = {
  user: UserModel;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 text-black bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white">
            {user.first_name[0]}
            {user.last_name[0]}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold mb-2">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-lg opacity-90 mb-1">{user.email}</p>
          <p className="opacity-90">{user.phone_number}</p>
        </div>
      </div>
      <ConfirmDeleteModal />
    </div >
  );
}

function ConfirmDeleteModal() {
  const navigate = useNavigate();
  const [Notify, setNotify] = useNotification(15000);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  function handleShowModal() {
    if (!modalRef.current) return;
    document.body.style.overflowY = "hidden";
    modalRef.current.showModal();
  }

  function handleClose() {
    if (!modalRef.current) return;
    document.body.style.overflowY = "auto";
    modalRef.current.close();
  }

  async function handleDelete() {
    if (!modalRef.current) return;
    document.body.style.overflowY = "auto";
    modalRef.current.close();
    const response = await deleteUser();
    if (response.success) {
      setNotify({ message: "Account cancellato con success", type: "success" });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate({ to: "/" });
    }
    setNotify({ message: response.message as string, type: "error" });
  }

  return (
    <>
      <Notify />
      <button onClick={handleShowModal} className="cursor-pointer absolute top-2 right-4 bg-red-100 hover:bg-red-300 p-2 rounded-lg">
        <Trash2 className="w-6 h-6 text-red-600 hover:text-red-800" />
      </button>

      <Modal ref={modalRef}>
        <div className="flex flex-col gap-6 p-3 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Sei sicuro di voler cancellare i dati del tuo utente?
          </h2>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleClose}
              className="cursor-pointer px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition"
            >
              Chiudi
            </button>
            <button
              onClick={handleDelete}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Conferma
            </button>
          </div>
        </div>
      </Modal >
    </>
  );
}


async function deleteUser(): Promise<ActionResponse> {
  const response = await userApi.delete("/delete");
  if (response.status !== 204) {
    return { success: false, message: "Operazione non concessa" };
  }
  return { success: true, message: "Utente cancellato con successo" };
}