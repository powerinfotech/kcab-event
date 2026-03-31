/**
 * useLocalStorage - 타입 안전한 로컬스토리지 상태 관리 훅
 *
 * [목적]
 * useState와 동일한 인터페이스로 localStorage를 사용한다.
 * 값이 변경되면 자동으로 localStorage에 JSON 직렬화하여 저장하고,
 * 새로고침 후에도 마지막 값이 복원된다.
 *
 * [특징]
 * - 제네릭 타입 지원: string, number, object 등 모든 타입 사용 가능
 * - SSR 안전: typeof window === 'undefined' 체크
 * - JSON 직렬화 자동 처리
 * - removeValue로 키 삭제 + 초기값 복원
 *
 * [사용 방법]
 * @example
 * // 문자열 저장
 * const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'light');
 * setTheme('dark');       // localStorage에 "dark" 저장
 * removeTheme();          // localStorage에서 제거 + 'light'로 복원
 *
 * // 객체 저장
 * const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
 * setSettings(prev => ({ ...prev, fontSize: 14 }));  // 함수형 업데이트도 가능
 *
 * // 숫자 저장
 * const [pageSize, setPageSize] = useLocalStorage<number>('pageSize', 10);
 */
import { useState, useCallback } from 'react';

type SetValue<T> = T | ((prev: T) => T);

/**
 * localStorage를 React 상태처럼 사용하는 훅
 *
 * @param key          - localStorage 키
 * @param initialValue - 초기값 (키가 없을 때 사용)
 * @returns [storedValue, setValue, removeValue]
 *   - storedValue:  현재 저장된 값
 *   - setValue:     값 설정 (함수형 업데이트 지원)
 *   - removeValue:  키 삭제 + 초기값 복원
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = localStorage.getItem(key);
            return item !== null ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: SetValue<T>) => {
            setStoredValue((prev) => {
                const nextValue = value instanceof Function ? value(prev) : value;
                try {
                    localStorage.setItem(key, JSON.stringify(nextValue));
                } catch {
                    // 용량 초과 등 무시
                }
                return nextValue;
            });
        },
        [key]
    );

    const removeValue = useCallback(() => {
        setStoredValue(initialValue);
        try {
            localStorage.removeItem(key);
        } catch {
            // 무시
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}
