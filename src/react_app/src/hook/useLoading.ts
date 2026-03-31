/**
 * useLoading - 글로벌 로딩 스피너 큐 관리 훅
 *
 * [목적]
 * 여러 API가 동시에 호출될 때 로딩 스피너를 올바르게 관리한다.
 * 큐(Queue) 방식으로 동작하여, 모든 API 호출이 완료되어야 스피너가 사라진다.
 * GlobalAxiosProvider에서 axios 인터셉터와 연동하여 자동으로 동작.
 *
 * [동작 방식]
 * 1. API 호출 시작 → add(key) → 큐에 추가 → 스피너 표시
 * 2. API 호출 완료 → remove(key) → 큐에서 제거 (500ms 딜레이로 깜빡임 방지)
 * 3. 큐가 비면 → 스피너 숨김
 *
 * [사용 방법]
 * @example
 * // 보통 GlobalAxiosProvider에서 자동 처리되므로 직접 사용할 일은 적음
 * // 수동으로 로딩을 제어해야 할 때:
 * const { add, remove, clear } = useLoading();
 *
 * const handleSave = async () => {
 *   add('save');           // 로딩 시작
 *   try {
 *     await callSaveData(data);
 *   } finally {
 *     remove('save');      // 로딩 종료
 *   }
 * };
 *
 * // 비정상 상태에서 로딩 강제 해제
 * clear();
 */
import {useSetRecoilState} from 'recoil';
import {loadingAtom} from '@atom/loadingAtom';
import {useRef} from 'react';

/**
 * 글로벌 로딩 큐 관리 훅
 *
 * @returns { add, remove, clear }
 *   - add(key):    로딩 큐에 키 추가 (스피너 표시)
 *   - remove(key): 로딩 큐에서 키 제거 (500ms 딜레이 후 반영, 깜빡임 방지)
 *   - clear():     로딩 큐 전체 초기화 (스피너 강제 해제)
 */
export const useLoading = () => {
    const setLoadings = useSetRecoilState<string[]>(loadingAtom);
    /** useRef로 동기적 큐 관리 (Recoil은 비동기라 즉시 반영 안 됨) */
    const loadingQueue = useRef<string[]>([]);

    /** 로딩 큐에 키 추가 → 스피너 표시 */
    const add = (key:string) => {
        const loadings:string[] = [...loadingQueue.current];
        loadings.push(key);
        loadingQueue.current = loadings;
        setLoadings(loadings);
    };

    /** 로딩 큐에서 키 제거 → 500ms 후 스피너 상태 반영 (깜빡임 방지) */
    const remove = (key:string) => {
        const loadings:string[] = [...loadingQueue.current];
        loadings.splice(loadings.findIndex(item=>item===key), 1);
        loadingQueue.current = loadings;
        setTimeout(()=>setLoadings(loadings), 500);
    };

    /** 로딩 큐 전체 초기화 → 스피너 강제 해제 */
    const clear = () => {
        const loadings:string[] = [];
        loadingQueue.current = [];
        setLoadings(loadings);
    };

    return {add, remove, clear};
};
