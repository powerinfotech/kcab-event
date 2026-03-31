/**
 * useDebounce - 값/콜백 디바운스 처리 훅
 *
 * [목적]
 * 검색 입력, 자동완성 등에서 사용자가 타이핑할 때마다 API를 호출하면 불필요한
 * 요청이 대량 발생한다. 디바운스를 적용하면 마지막 입력 후 일정 시간(delay) 동안
 * 추가 입력이 없을 때만 1회 실행하여 성능을 최적화한다.
 *
 * [제공 함수]
 * - useDebounce(value, delay)           : 값의 디바운스 (상태값 지연 반영)
 * - useDebouncedCallback(callback, delay): 콜백의 디바운스 (함수 실행 지연)
 *
 * [사용 방법]
 * @example
 * // 1. 값 디바운스 — 검색어 입력 후 300ms 대기 후 조회
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 *
 * <CustomInput value={search} onChange={(e) => setSearch(e.target.value)} />
 *
 * // 2. 콜백 디바운스 — 함수 자체를 디바운스
 * const debouncedSave = useDebouncedCallback((data: FormData) => {
 *   callSaveData(data);
 * }, 500);
 *
 * <CustomInput onChange={(e) => debouncedSave(e.target.value)} />
 */
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * 값의 디바운스 처리
 * - value가 변경되면 delay(ms) 후에 debouncedValue가 갱신됨
 *
 * @param value - 디바운스할 값
 * @param delay - 대기 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * 콜백의 디바운스 처리
 * - 마지막 호출 후 delay(ms) 동안 추가 호출이 없을 때만 실행
 * - 콜백 참조는 항상 최신 유지 (stale closure 방지)
 *
 * @param callback - 디바운스할 함수
 * @param delay    - 대기 시간 (밀리초)
 * @returns 디바운스된 함수
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
        },
        [delay]
    );
}
