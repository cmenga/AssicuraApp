import { useRef } from "react";
import { Lock } from "lucide-react";

import type { ActionResponse } from "@/shared/type";
import BaseField from "./BaseField";
import FormInputPassword from "@/shared/components/form/FormInputPassword";
import { handlePasswordKeyPress } from "@/shared/utils/onKeyDown";
import { ErrorMessage } from "@/shared/components/form/FormMessage";
import { useFormStateAction } from "@/shared/hooks/useFormStateAction";
import { useNavigate } from "@tanstack/react-router";
import { userApi } from "@/shared/api/http";
import { UpdateCardForm, type UpdateCardFormHandle } from "@/shared/components/form/UpdateCardForm";


export default function ChangePassword() {
    const navigate = useNavigate();
    const cardRef = useRef<UpdateCardFormHandle | null>(null);
    const { errors, message, isPending, submitAction, cleanErrors } = useFormStateAction(submitPasswordAction, {
        onSuccess: async () => { cleanErrors(); handleEdit(); navigate({ to: "/profile" }); }
    });

    function handleEdit() {
        if (cardRef.current)
            cardRef.current.onEdit(false);
    }
    return (
        <UpdateCardForm ref={cardRef} cleanErrors={cleanErrors} isPending={isPending} onSubmit={submitAction}>
            <UpdateCardForm.Header icon={Lock} name="Credenziali" />
            <UpdateCardForm.Errors field="body" errors={errors} />
            <UpdateCardForm.Success message={message} />
            <UpdateCardForm.Read>
                <BaseField field={"*******"} label="Password" />
            </UpdateCardForm.Read>
            <UpdateCardForm.Editable>
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
            </UpdateCardForm.Editable>
        </UpdateCardForm>
    );
}


async function submitPasswordAction(formData: FormData): Promise<ActionResponse> {
    const data = Object.fromEntries(formData.entries());
    const response = await userApi.patch("/change-password", data);

    switch (response.status) {
        case 403:
            return { errors: { body: "Non è stato possibile cambiare passowrd" }, success: false };
        case 422:
            return { errors: response.data.errors, success: false };
    }
    return { message: "Password cambiata con successo", success: true };
}
