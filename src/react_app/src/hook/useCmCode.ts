import {getViewCmCode} from '@api/CommonApi';
import {useAsync} from 'react-async';

export const useCmCode = (cmGroupCodeList:string[]) => {
    const { data } = useAsync({promiseFn: getViewCmCode, cmGroupCodeList, watch:'1'});
    if(data === undefined) {
        return {};
    }

    return data;
};