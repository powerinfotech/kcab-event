import {atom} from 'recoil';

export const loadingAtom = atom<string[]>({
   key:'loadingStatus',
   default:[]
});