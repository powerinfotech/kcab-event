import { atom } from 'recoil';

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    setSelf(JSON.parse(saved));
  }
  onSet((newValue: boolean, _: any, isReset: boolean) => {
    if (isReset) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export const tabModeAtom = atom<boolean>({
  key: 'tabMode',
  default: false,
  effects_UNSTABLE: [localStorageEffect('tabMode')],
});
