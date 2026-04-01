import { atom } from 'jotai';
import { MenuInfo } from '@interface/auth/MenuManagement';

export const menuInfoAtom = atom<MenuInfo[]>([]);
