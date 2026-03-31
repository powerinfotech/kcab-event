/**
 * storageUtils - 타입 안전한 브라우저 스토리지 접근 유틸
 *
 * [목적]
 * localStorage / sessionStorage에 JSON 직렬화/역직렬화를 자동 처리하여
 * 타입 안전하게 데이터를 저장하고 조회한다.
 * SSR 환경(window 미존재)에서도 에러 없이 동작.
 *
 * [사용 방법]
 * @example
 * import { getStorageItem, setStorageItem, removeStorageItem } from '@util/storageUtils';
 *
 * // localStorage (기본값)
 * setStorageItem('theme', 'dark');
 * const theme = getStorageItem<string>('theme');     → 'dark'
 *
 * // sessionStorage
 * setStorageItem('token', tokenObj, 'session');
 * const token = getStorageItem<TokenType>('token', 'session');
 *
 * // 삭제
 * removeStorageItem('theme');
 */
type StorageType = 'local' | 'session';

function getStorage(type: StorageType): Storage | null {
    if (typeof window === 'undefined') return null;
    return type === 'local' ? localStorage : sessionStorage;
}

/**
 * 스토리지에서 값 조회 (JSON 파싱)
 * @example getStorageItem<string>('theme') → 'dark'
 * @example getStorageItem<User>('user', 'session') → { userId: '...', ... }
 */
export function getStorageItem<T>(key: string, type: StorageType = 'local'): T | null {
    const storage = getStorage(type);
    if (!storage) return null;
    try {
        const item = storage.getItem(key);
        return item !== null ? (JSON.parse(item) as T) : null;
    } catch {
        return null;
    }
}

/**
 * 스토리지에 값 저장 (JSON 직렬화)
 * @example setStorageItem('theme', 'dark')
 * @example setStorageItem('user', userObj, 'session')
 */
export function setStorageItem<T>(key: string, value: T, type: StorageType = 'local'): void {
    const storage = getStorage(type);
    if (!storage) return;
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {
        // 용량 초과 등 무시
    }
}

/**
 * 스토리지에서 값 삭제
 */
export function removeStorageItem(key: string, type: StorageType = 'local'): void {
    const storage = getStorage(type);
    if (!storage) return;
    storage.removeItem(key);
}

/**
 * 스토리지 전체 초기화
 */
export function clearStorage(type: StorageType = 'local'): void {
    const storage = getStorage(type);
    if (!storage) return;
    storage.clear();
}
