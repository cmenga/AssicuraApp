import FormInputEmail from "@/shared/components/form/FormInputEmail";
import { Mail } from "lucide-react";

import BaseField from "./BaseField";
import FormInputPhoneNumber from "@/shared/components/form/FormInputPhoneNumber";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { useNavigate } from "@tanstack/react-router";
import { handleEmailKeyPress, handleNumberKeyPress } from "@/shared/utils/onKeyDown";
import { UpdateCardForm, type UpdateCardFormHandle } from "@/shared/components/form/UpdateCardForm";
import { useRef } from "react";
import { userApi } from "@/shared/api/http";
import type { ActionResponse, UserModel } from "@/shared/type";
import { store } from "@/shared/store";

type ContactsProps = {
  email: string;
  phoneNumber: string;
};

export default function Contacts({ email, phoneNumber }: ContactsProps) {
  const cardRef = useRef<UpdateCardFormHandle | null>(null);
  const navigate = useNavigate();
  const { errors, message, isPending, submitAction, cleanErrors } = useFormStateAction(submitContactAction, {
    onSuccess: async () => { await updateContacts(); cleanErrors(); handleEdit(); navigate({ to: "/profile" }); }
  });

  function handleEdit() {
    if (cardRef.current)
      cardRef.current.onEdit(false);
  }

  return (
    <UpdateCardForm ref={cardRef} cleanErrors={cleanErrors} isPending={isPending} onSubmit={submitAction} >
      <UpdateCardForm.Header icon={Mail} name="Contatti" />
      <UpdateCardForm.Errors field="body" errors={errors} />
      <UpdateCardForm.Success message={message} />
      <UpdateCardForm.Editable>
        <FormInputEmail previous={email} name="email" onKeyDown={handleEmailKeyPress}>
          {errors?.email && <ErrorMessage message={errors.email} />}
        </FormInputEmail>
        <FormInputPhoneNumber previous={phoneNumber} name="phone_number" maxLength={10} minLength={10} onKeyDown={handleNumberKeyPress}  >
          {errors?.phone_number && <ErrorMessage message={errors.phone_number} />}
        </FormInputPhoneNumber>
      </UpdateCardForm.Editable>
      <UpdateCardForm.Read>
        <BaseField field={email} label="email" />
        <BaseField field={phoneNumber} label="telefono" />
      </UpdateCardForm.Read>
    </UpdateCardForm>
  );
}


async function submitContactAction(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await userApi.patch("/update-contact", data, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  switch (response.status) {
    case 404:
      return { errors: { body: "Risorsa non trovata" }, success: false };
    case 422:
      return { errors: response.data.errors, success: false };
  }
  return { message: "I tuoi contatti sono stati cambiati con successo", success: true };
}

async function updateContacts() {
  const response = await userApi.get("/me");
  if (response.status === 200) {
    store.dispatch<UserModel>("user", (prev) => ({ ...prev, ...response.data }));
  }
}