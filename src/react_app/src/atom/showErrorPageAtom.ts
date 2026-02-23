import { atom } from 'recoil';

export const showErrorPageAtom = atom<boolean>({
  key: 'showErrorPage',
  default: false,
});
