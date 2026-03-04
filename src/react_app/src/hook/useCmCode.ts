import {getViewCmCode} from '@api/CommonApi';
import {CommonCodeMap} from '@interface/common';
import {useEffect, useMemo, useState} from 'react';

const cmCodeCache = new Map<string, {[key: string]: string}>();

export function bustCmCodeCache() {
    cmCodeCache.clear();
}

export const useCmCode = (cmGroupCodeList: string[]): CommonCodeMap => {
    const listKey = cmGroupCodeList.join(',');
    const stableList = useMemo(() => [...cmGroupCodeList], [listKey]);

    const [data, setData] = useState<CommonCodeMap | null>(() => {
        const allCached = stableList.every(code => cmCodeCache.has(code));
        if (allCached && stableList.length > 0) {
            const result: CommonCodeMap = {};
            stableList.forEach(code => {
                result[code] = cmCodeCache.get(code)!;
            });
            return result;
        }
        return null;
    });

    useEffect(() => {
        const missingCodes = stableList.filter(code => !cmCodeCache.has(code));

        if (missingCodes.length === 0 && stableList.length > 0) {
            const result: CommonCodeMap = {};
            stableList.forEach(code => {
                result[code] = cmCodeCache.get(code)!;
            });
            setData(result);
            return;
        }

        if (stableList.length === 0) {
            setData({});
            return;
        }

        let cancelled = false;
        getViewCmCode({cmGroupCodeList: missingCodes})
            .then((result) => {
                if (!cancelled) {
                    Object.entries(result).forEach(([key, value]) => {
                        cmCodeCache.set(key, value);
                    });
                    const merged: CommonCodeMap = {};
                    stableList.forEach(code => {
                        merged[code] = cmCodeCache.get(code) ?? {};
                    });
                    setData(merged);
                }
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
