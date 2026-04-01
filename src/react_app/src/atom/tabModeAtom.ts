import { atomWithStorage } from 'jotai/utils';

export const tabModeAtom = atomWithStorage<boolean>('tabMode', false);
