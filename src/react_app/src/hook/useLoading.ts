import {useSetRecoilState} from 'recoil';
import {loadingAtom} from '@atom/loadingAtom';
import {useRef} from 'react';

export const useLoading = () => {
    const setLoadings = useSetRecoilState<string[]>(loadingAtom);
    const loadingQueue = useRef<string[]>([]);

    const add = (key:string) => {
        const loadings:string[] = [...loadingQueue.current];
        loadings.push(key);
        loadingQueue.current = loadings;
        setLoadings(loadings);
    };

    const remove = (key:string) => {
        const loadings:string[] = [...loadingQueue.current];
        loadings.splice(loadings.findIndex(item=>item===key), 1);
        loadingQueue.current = loadings;
        setTimeout(()=>setLoadings(loadings), 500);
    };

    const clear = () => {
        const loadings:string[] = [];
        loadingQueue.current = [];
        setLoadings(loadings);
    };

    return {add, remove, clear};
};
