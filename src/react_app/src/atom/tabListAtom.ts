import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export interface TabItem {
  key: string;
  menuSeq: number;
  menuNm: string;
  menuUrl: string;
  menuViewPath: string;
  menuNamePath: string;
}

export const tabListAtom = atomWithStorage<TabItem[]>(
  'tabList',
  [],
  createJSONStorage(() => sessionStorage)
);

export const activeTabKeyAtom = atomWithStorage<string | null>(
  'activeTabKey',
  null,
  createJSONStorage(() => sessionStorage)
);
