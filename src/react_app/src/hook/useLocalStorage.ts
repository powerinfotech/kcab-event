import { useState, useCallback } from 'react';

type SetValue<T> = T | ((prev: T) => T);

/**
 * 타입 안전한 로컬스토리지 상태 관리 훅
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'light');
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
