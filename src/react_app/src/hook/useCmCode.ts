import {getViewCmCode} from '@api/CommonApi';
import {CommonCodeMap} from '@interface/common';
import {useEffect, useMemo, useState} from 'react';

export const useCmCode = (cmGroupCodeList: string[]): CommonCodeMap => {
    const listKey = cmGroupCodeList.join(',');
    const stableList = useMemo(() => [...cmGroupCodeList], [listKey]);

    const [data, setData] = useState<CommonCodeMap | null>(null);

    useEffect(() => {
        let cancelled = false;
        getViewCmCode({cmGroupCodeList: stableList})
            .then((result) => {
                if (!cancelled) setData(result);
            })
            .catch(() => {
                if (!cancelled) setData({});
            });
        return () => {
            cancelled = true;
        };
    }, [listKey]);

    if (data === null) {
        return {};
    }
    return data;
};