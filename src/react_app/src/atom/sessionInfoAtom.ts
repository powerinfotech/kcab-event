import {SessionUserInfo} from '@interface/common';
import {atom} from 'recoil';


const defaultUserInfo: SessionUserInfo = {
    userId: '',
    userName: '',
    admYn: 'N',
};

export const sessionInfoAtom = atom<SessionUserInfo>({
    key: 'sessionInfo',
    default: defaultUserInfo
});

