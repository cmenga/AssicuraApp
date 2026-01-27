import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import BaseField from "./BaseField";
import { useState } from "react";
import { Lock, Pencil, Save, X } from "lucide-react";
import FormInputPassword from "@/shared/components/form/FormInputPassword";
import { handlePasswordKeyPress } from "@/shared/utils/onKeyDown";
import ErrorMessage from "@/shared/components/form/ErrorMessage";
import { submitPasswordAction } from "../../action";
import { useNavigate } from "@tanstack/react-router";


export default function ChangePassword() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>();
    const { errors, isPending, submitAction, cleanErrors } = useFormStateAction(submitPasswordAction, {
        onSuccess: async () => { cleanErrors(); setEditMode(false); navigate({ to: "/profile" }); }
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
                <Lock className="w-6 h-6 text-blue-600" />
                Credenziali
            </h3>
            {errors?.change_password && <ErrorMessage message={errors?.change_password} />}
            <div className="grid md:grid-cols-2 gap-6">
                {editMode && (
                    <>
                        <div className="col-span-2">
                            <FormInputPassword labelName="Vecchia password" name="old_password" onKeyDown={handlePasswordKeyPress}>
                                {errors?.old_password && <ErrorMessage message={errors.old_password} />}
                            </FormInputPassword>
                        </div>
                        <FormInputPassword labelName="Nuova password" name="new_password" onKeyDown={handlePasswordKeyPress}>
                            {errors?.new_password && <ErrorMessage message={errors.new_password} />}
                        </FormInputPassword>
                        <FormInputPassword labelName="Conferma nuova password" name="confirm_password" onKeyDown={handlePasswordKeyPress}>
                            {errors?.confirm_password && <ErrorMessage message={errors.confim_password} />}
                        </FormInputPassword>
                    </>
                )}
                {!editMode && (
                    <>
                        <BaseField field={"*******"} label="Password" />
                    </>
                )}
            </div>
        </form>
    );
}