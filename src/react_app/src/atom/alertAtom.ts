import { atom } from 'jotai';

export type AlertState = {
    message: string;
    okText?: string;
    onClickOK: () => void;
    isOpen: boolean;
};

export const alertAtom = atom<AlertState | undefined>(undefined);
