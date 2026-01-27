import { MapPin, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import BaseField from "./BaseField";
import type { AddressModel } from "@/shared/type";
import FormInputText from "@/shared/components/form/FormInputText";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import { submitAddressACtion } from "../../action";
import ErrorMessage from "@/shared/components/form/ErrorMessage";
import { useNavigate } from "@tanstack/react-router";
import { userApi } from "@/shared/api/user.service";
import { handleCivicKeyPress, handleNameKeyPress, handleNumberKeyPress, handleProvinceKeyPress, handleStreetKeyPress } from "@/shared/utils/onKeyDown";
import { store } from "@/shared/model/store";

async function updateAddressData(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  store.asyncdispatch("address", async (prev: AddressModel | undefined) => {
     if (!prev) {
      const response = userApi.get("/addresses") 
       return (await response).data[0]
    }

    return {
      ...prev,
      ...data
    };
  });
}

type AddressProps = {
  address: AddressModel;
};
export default function Address({ address }: AddressProps) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<boolean>(false);
  const { isPending, errors, submitAction, cleanErrors } = useFormStateAction(submitAddressACtion, {
    onSuccess: async (formData) => { await updateAddressData(formData); setEditMode(false); navigate({ to: "/profile" }); }
  });

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
            disabled={isPending}
            onClick={() => { setEditMode(false); cleanErrors(); }}
            className="cursor-pointer flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
            Annulla
          </button>
          <button
            type="submit"
            className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <Save className="w-5 h-5" />
            {isPending ? "Salvataggio ..." : "Salva"}
          </button>
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        Residenza
      </h3>

      {errors?.residence_province && <ErrorMessage message={errors.residence_province} />}

      <div className="grid md:grid-cols-2 gap-6">
        {!editMode && (
          <>
            <div className="md:col-span-2">
              <BaseField field={address.street} label="Indirizzo" />
            </div>
            <BaseField field={address.civic_number} label="Civico" />
            <BaseField field={address.city} label="Città" />
            <BaseField field={address.cap} label="Cap" />
            <BaseField field={address.province} label="Provincia" />
          </>
        )}
        {editMode && (
          <>
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
          </>
        )}
      </div>
    </form>
  );
}
