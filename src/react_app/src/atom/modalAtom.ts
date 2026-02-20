import {atom} from 'recoil';
import {ReactNode} from 'react';


export const modalAtom = atom<ReactNode>({
    key: 'modalStatus',
    default: null
});