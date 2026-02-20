import {SessionUserInfo} from '@interface/common';
import {atom} from 'recoil';


const defaultUserInfo:SessionUserInfo = {
    userId: '',
    userName: '',
    admFlag: false
};

export const sessionInfoAtom = atom<SessionUserInfo>({
    key: 'sessionInfo',
    default: defaultUserInfo
});

