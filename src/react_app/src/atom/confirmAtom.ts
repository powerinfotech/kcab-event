import { atom } from 'jotai';

export type ConfirmState = {
    message: string;
    okText?: string;
    cancelText?: string;
    onClickOK: () => void;
    onClickCancel: () => void;
    isOpen: boolean;
};

export const confirmAtom = atom<ConfirmState | undefined>(undefined);
