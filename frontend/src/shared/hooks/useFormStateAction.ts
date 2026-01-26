import { useCallback, useState, type FormEvent } from "react";
import type { ActionResponse } from "../type";

/**
 * The function useFormStateAction handles form submission actions, including asynchronous requests and
 * callbacks for different stages of the process.
 * @param action - The `action` parameter in the `useFormStateAction` function is a function that takes
 * a `FormData` object as a parameter and returns a `Promise` that resolves to an `ActionResponse`.
 * This function is responsible for handling the form submission logic, such as making an API request
 * with the
 * @param [callbacks] - The `callbacks` parameter in the `useFormStateAction` function is an optional
 * object that can contain the following callback functions:
 * @returns The function `useFormStateAction` returns an object with the following properties:
 */
export function useFormStateAction(action: (formData: FormData) => Promise<ActionResponse>, callbacks?: { onStart?: () => void, onEnd?: () => void; onSuccess?: (formData: FormData) => void; }) {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string> | undefined>(undefined);

    const submitAction = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<ActionResponse> => {
        event.preventDefault();
        setIsPending(true);
        callbacks?.onStart?.();

        try {
            const formData: FormData = new FormData(event.currentTarget);
            const response = await action(formData);
            await new Promise((resolve) => setTimeout(resolve, 500));
            response.errors && setErrors(response.errors);
            response.success && callbacks?.onSuccess?.(formData);
            return response;
        } finally {
            setIsPending(false);
            callbacks?.onEnd?.();
        }
    }, [action]);

    const cleanErrors = useCallback(() => setErrors(undefined), [setErrors]);

    return { errors, isPending, submitAction, cleanErrors };
}