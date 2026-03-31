import { atom } from 'recoil';

export interface TabItem {
  key: string;
  menuSeq: number;
  menuNm: string;
  menuUrl: string;
  menuViewPath: string;
  menuNamePath: string;
}

const sessionStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  if (typeof window === 'undefined') return;
  const saved = sessionStorage.getItem(key);
  if (saved !== null) {
    try {
      setSelf(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem(key);
    }
  }
  onSet((newValue: any, _: any, isReset: boolean) => {
    if (isReset) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export const tabListAtom = atom<TabItem[]>({
  key: 'tabList',
  default: [],
  effects_UNSTABLE: [sessionStorageEffect('tabList')],
});

export const activeTabKeyAtom = atom<string | null>({
  key: 'activeTabKey',
  default: null,
  effects_UNSTABLE: [sessionStorageEffect('activeTabKey')],
});
