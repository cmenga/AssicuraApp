import { useRef } from "react";

import { MapPin } from "lucide-react";

import BaseField from "./BaseField";
import type { ActionResponse, AddressModel } from "@/shared/type";
import FormInputText from "@/shared/components/form/FormInputText";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import {ErrorMessage} from "@/shared/components/form/FormMessage";
import { useNavigate } from "@tanstack/react-router";
import { userApi } from "@/shared/api/http";
import { handleCivicKeyPress, handleNameKeyPress, handleNumberKeyPress, handleProvinceKeyPress, handleStreetKeyPress } from "@/shared/utils/onKeyDown";
import { UpdateCardForm, type UpdateCardFormHandle } from "@/shared/components/form/UpdateCardForm";
import { store } from "@/shared/store";

type AddressProps = {
  address: AddressModel;
};


export default function Address({ address }: AddressProps) {
  const cardRef = useRef<UpdateCardFormHandle | null>(null);
  const navigate = useNavigate();
  const { isPending, errors, message, submitAction, cleanErrors  } = useFormStateAction(submitAddressACtion, {
    onSuccess: async () => { await updateAddress(); cleanErrors(); handleEdit(); navigate({ to: "/profile" }); }
  });

  function handleEdit() {
    if (cardRef.current) cardRef.current.onEdit(false);
  }
  return (
    <UpdateCardForm ref={cardRef} onSubmit={submitAction} isPending={isPending} cleanErrors={cleanErrors}>
      <UpdateCardForm.Header icon={MapPin} name="Residenza" />
      <UpdateCardForm.Errors errors={errors} field="body" />
      <UpdateCardForm.Success message={message} />
      <UpdateCardForm.Read>
        <div className="md:col-span-2">
          <BaseField field={address.street} label="Indirizzo" />
        </div>
        <BaseField field={address.civic_number} label="Civico" />
        <BaseField field={address.city} label="Città" />
        <BaseField field={address.cap} label="Cap" />
        <BaseField field={address.province} label="Provincia" />
      </UpdateCardForm.Read>
      <UpdateCardForm.Editable>
        <div className="md:col-span-2">
          <FormInputText
            labelName="Indirizzo"
            name="street"
            previous={address.street}
            onKeyDown={handleStreetKeyPress}
          >
            {errors?.street && <ErrorMessage message={errors.street} />}
          </FormInputText>
        </div>
        <FormInputText
          labelName="Civico"
          name="civic_number"
          previous={address.civic_number}
          onKeyDown={handleCivicKeyPress}
        >
          {errors?.civic_number && <ErrorMessage message={errors.civic_number} />}
        </FormInputText>
        <FormInputText
          labelName="Città"
          name="city"
          previous={address.city}
          onKeyDown={handleNameKeyPress}
        >
          {errors?.city && <ErrorMessage message={errors.city} />}
        </FormInputText>
        <FormInputText
          labelName="Cap"
          name="cap"
          previous={address.cap.toString()}
          onKeyDown={handleNumberKeyPress}
        >
          {errors?.cap && <ErrorMessage message={errors.cap} />}
        </FormInputText>
        <FormInputText
          labelName="Provincia"
          name="province"
          previous={address.province}
          onKeyDown={handleProvinceKeyPress}
        >
          {errors?.province && <ErrorMessage message={errors.province} />}
        </FormInputText>
      </UpdateCardForm.Editable>
    </UpdateCardForm>
  );
}


export async function submitAddressACtion(formData: FormData): Promise<ActionResponse> {
  const data = Object.fromEntries(formData.entries());
  const response = await userApi.put("/update-address", data);

  switch (response.status) {
    case 401:
      return { errors: { body: 'La sessione potrebbe essere scaduta, la preghiamo di rieffettuare il login' }, success: false };
    case 404:
      return { errors: {body: "Risorsa non trovata"}, success: false };
    case 422:
      let errors = {};
      response.data.errors.forEach((err: Record<string, string>) => {
        if (err["body"]?.toLowerCase().includes("cap")) {
          errors = { ...errors, cap: err["body"] };
          return;
        } errors = { ...errors, [err.field]: err.message };
      });
      return {
        message: response.data.message,
        success: false,
        errors: errors
      };
  }
  return {message:"La residenza è stata cambiata con successo",  success: true };
}


async function updateAddress() {
  const response = await userApi.get("/addresses")
  if (response.status === 200) {
    store.dispatch<AddressModel>("address", (prev) => ({ ...prev, ...response.data }))
    return
  }
  return
}