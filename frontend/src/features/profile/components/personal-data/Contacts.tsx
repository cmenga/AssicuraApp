import FormInputEmail from "@/shared/components/form/FormInputEmail";
import { Mail, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import BaseField from "./BaseField";
import FormInputPhoneNumber from "@/shared/components/form/FormInputPhoneNumber";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import { submitContactAction } from "../../action";
import ErrorMessage from "@/shared/components/form/ErrorMessage";
import { userApi } from "@/shared/api/user.service";
import { useNavigate } from "@tanstack/react-router";
import { handleEmailKeyPress, handleNumberKeyPress } from "@/shared/utils";



async function updateLoggedUser() {
  const response = await userApi.get("/me");
  sessionStorage.setItem("user_data", JSON.stringify(response.data));
}

type ContactsProps = {
  email: string;
  phoneNumber: string;
};

export default function Contacts({ email, phoneNumber }: ContactsProps) {
  const navigate = useNavigate();
  const { errors, isPending, submitAction, cleanErrors } = useFormStateAction(submitContactAction, {
    onSuccess: async () => {await updateLoggedUser(); setEditMode(false); navigate({ to: "/profile" }); }
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <form onSubmit={submitAction} className="relative bg-white rounded-2xl shadow-md p-6">
      {!editMode && (
        <Pencil
          onClick={() => setEditMode(true)}
          className="cursor-pointer absolute right-4 w-6 h-6 text-gray-600"
        />
      )}

      {editMode && (
        <div className="absolute right-4 flex gap-3">
          <button
            onClick={() => { setEditMode(false); cleanErrors(); }}
            className="cursor-pointer flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
            Annulla
          </button>
          <button
            disabled={isPending}
            type="submit"
            className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <Save className="w-5 h-5" />
            {isPending ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      )}

      <h3 className=" text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6 text-blue-600" />
        Contatti
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {editMode && (
          <>
            <FormInputEmail previous={email} name="email"  onKeyDown={handleEmailKeyPress}>
              {errors?.email && <ErrorMessage message={errors.email} />}
            </FormInputEmail>
            <FormInputPhoneNumber previous={phoneNumber} name="phone_number" maxLength={10} minLength={10} onKeyDown={handleNumberKeyPress}  >
              {errors?.phone_number && <ErrorMessage message={errors.phone_number} />}
            </FormInputPhoneNumber>

          </>
        )}
        {!editMode && (
          <>
            <BaseField field={email} label="email" />
            <BaseField field={phoneNumber} label="telefono" />
          </>
        )}
      </div>
    </form>
  );
}

