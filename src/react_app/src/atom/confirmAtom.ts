import {atom} from 'recoil';


export type ConfirmState = {
    message: string;
    okText?:string;
    cancelText?:string;
    onClickOK: () => void;
    onClickCancel: () => void;
    isOpen:boolean;
};

export const confirmAtom = atom<ConfirmState>({
    key: 'confirmStatus',
    default: undefined
});
