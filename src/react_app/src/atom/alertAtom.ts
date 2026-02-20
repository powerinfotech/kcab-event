import {atom} from 'recoil';


export type AlertState = {
    message: string;
    okText?:string;
    onClickOK: () => void;
    isOpen:boolean;
};

export const alertAtom = atom<AlertState>({
    key: 'alertStatus',
    default: undefined
});
