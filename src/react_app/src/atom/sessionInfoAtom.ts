import { SessionUserInfo } from '@interface/common';
import { atom } from 'jotai';

const defaultUserInfo: SessionUserInfo = {
    userId: '',
    userName: '',
    admYn: 'N',
    organizationName: '',
};

export const sessionInfoAtom = atom<SessionUserInfo>(defaultUserInfo);
