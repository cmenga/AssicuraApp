import { forwardRef } from 'react';
import type { Ref, MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
    children: ReactNode;
    onClose?: () => void;
};

export const Modal = forwardRef(function Modal(props: ModalProps,
    ref: Ref<HTMLDialogElement>,
) {
    const { children, onClose } = props;
    function toggleDialog(e: MouseEvent<HTMLDialogElement>) {
        if (onClose && e.currentTarget === e.target) onClose();
    }

    return createPortal(
        <dialog
            ref={ref}
            className='fixed inset-0 m-auto border-none rounded-2xl'
            onClick={toggleDialog}
        >
            {children}
        </dialog>,
        document.body,
    );
});