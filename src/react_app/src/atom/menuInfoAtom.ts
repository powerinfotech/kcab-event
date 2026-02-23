import { atom } from 'recoil';
import { MenuInfo } from '@interface/auth/MenuManagement';

export const menuInfoAtom = atom<MenuInfo[]>({
  key: 'menuInfo',
  default: [],
});
