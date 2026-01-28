import type { ActionResponse } from "@/shared/type";
import { Pencil, Save, X, type LucideProps } from "lucide-react";
import React, { useState, useImperativeHandle, forwardRef, type FormEvent, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from "react";
import {ErrorMessage, SuccessMessage} from "./FormMessage";


function UpdateCardFormHeader({ icon, name }: {
    name: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}) {
    const IconComponent = icon;
    return (
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <IconComponent className="w-6 h-6 text-blue-600" />
            {name}
        </h3>
    );
};

function UpdateCardFormErrors({ errors, field }: { errors?: Record<string, string>, field: string; }) {
    if (errors && errors[field])
        return <ErrorMessage message={errors[field]} />;
    return null;
};

function UpdateCardFormSuccess({ message }: { message?: string; }) {
    if (message)
        return <SuccessMessage message={message} />
    return null
}
function UpdateCardFormRead({ children }: { children: ReactNode; }) {
    return children;
};


function UpdateCardFormEditable({ children }: { children: ReactNode; }) {
    return children;
};

type UpdateCardFormType = React.ForwardRefExoticComponent<
    UpdateCardFormProps & React.RefAttributes<unknown>
> & {
    Header: typeof UpdateCardFormHeader;
    Errors: typeof UpdateCardFormErrors;
    Success: typeof UpdateCardFormSuccess;
    Read: typeof UpdateCardFormRead;
    Editable: typeof UpdateCardFormEditable;
};


type UpdateCardFormProps = {
    isPending: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<ActionResponse>;
    cleanErrors: () => void;
    children: ReactNode;
};

export type UpdateCardFormHandle = {
    onEdit: (isEdit: boolean) => void;
};

export const UpdateCardForm = forwardRef<UpdateCardFormHandle, UpdateCardFormProps>(({ isPending, onSubmit, cleanErrors, children }, ref) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const slots = {
        header: null as ReactNode,
        errors: null as ReactNode,
        success: null as ReactNode,
        read: null as ReactNode,
        editable: null as ReactNode
    };

    useImperativeHandle(ref, () => ({
        onEdit: (isEdit: boolean) => {setEditMode(isEdit);
        }
    }));
    React.Children.forEach(children, child => {
        if (!React.isValidElement(child)) return;

        switch ((child.type as any).__slot) {
            case "header":
                slots.header = child;
                break;
            case "errors":
                slots.errors = child;
                break;
            case "success":
                slots.success = child;
                break;
            case "editable":
                slots.editable = child;
                break;
            case "read":
                slots.read = child;
                break;
        }
    });
    return (
        <form onSubmit={onSubmit} className="relative bg-white rounded-2xl shadow-md p-6">
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

            {slots.header}
            {slots.success}
            {slots.errors}

            <div className="grid md:grid-cols-2 gap-6">
                {!editMode && slots.read}
                {editMode && slots.editable}
            </div>
        </form>
    );
}) as UpdateCardFormType;

UpdateCardForm.Header = UpdateCardFormHeader;
(UpdateCardForm.Header as any).__slot = "header";
UpdateCardForm.Errors = UpdateCardFormErrors;
(UpdateCardForm.Errors as any).__slot = "errors";
UpdateCardForm.Success = UpdateCardFormSuccess;
(UpdateCardForm.Success as any).__slot = "success";
UpdateCardForm.Read = UpdateCardFormRead;
(UpdateCardForm.Read as any).__slot = "read";
UpdateCardForm.Editable = UpdateCardFormEditable;
(UpdateCardForm.Editable as any).__slot = "editable";





