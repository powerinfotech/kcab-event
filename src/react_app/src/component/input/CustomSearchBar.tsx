/**
 * CustomSearchBar - 디바운스 + IME(한글) 안전 처리 검색 입력 컴포넌트
 *
 * [목적]
 * Ant Design Input.Search를 래핑하여 다음 기능을 추가한다.
 * 1. 타이핑 중 디바운스(기본 300ms) 적용
 * 2. 한글/IME 조합 중 불필요한 검색 이벤트 방지
 *
 * [IME 처리 설명 - 핵심 기능]
 * 기존 문제: "검색" 입력 시 'ㄱ' → '거' → '검' → '검ㅅ' → '검색' 각 단계마다
 *           onChange가 발생해 debounce 타이머가 리셋됨.
 *           타이밍에 따라 중간 조합값('검')으로 API가 호출될 수 있음.
 *
 * 수정 후:
 *   compositionStart → isComposingRef = true  (조합 시작, debounce 차단)
 *   onChange('ㄱ')   → 조합 중 → 무시
 *   onChange('검색') → 조합 중 → 무시
 *   compositionEnd  → isComposingRef = false + debounce 시작 → API 1회 호출
 *
 * [버튼 / Enter 검색]
 * onSearch (검색 버튼 클릭, Enter 키)는 IME 상태와 무관하게 즉시 실행된다.
 *
 * @param onSearch   - 검색어 전달 콜백 (string)
 * @param debounceMs - 타이핑 디바운스 대기 시간 ms (기본: 300, 0이면 디바운스 없음)
 *
 * [사용 방법]
 * @example
 * // 기본 (300ms 디바운스 + 한글 IME 안전)
 * <CustomSearchBar
 *   placeholder="검색어 입력"
 *   onSearch={(value) => fetchData(value)}
 * />
 *
 * // 즉시 검색 (버튼 클릭/Enter 시에만)
 * <CustomSearchBar
 *   placeholder="사용자명 검색"
 *   onSearch={handleSearch}
 *   debounceMs={0}
 * />
 *
 * // 넓이 지정
 * <CustomSearchBar style={{ width: 300 }} onSearch={handleSearch} />
 */
import React, { useCallback, useRef } from 'react';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input';

const { Search } = Input;

interface CustomSearchBarProps extends Omit<SearchProps, 'onSearch'> {
    onSearch?: (value: string) => void;
    debounceMs?: number;
}

const CustomSearchBar = ({ onSearch, debounceMs = 300, ...rest }: CustomSearchBarProps) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    /** 한글/IME 조합 진행 중 여부 (true이면 debounce 검색 차단) */
    const isComposingRef = useRef(false);

    /** 검색 버튼 클릭 또는 Enter 키 → IME 상태 무관하게 즉시 실행 */
    const handleSearch = useCallback(
        (value: string) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            onSearch?.(value);
        },
        [onSearch]
    );

    /** 타이핑 onChange → IME 조합 중이면 무시, 아니면 debounce 후 검색 */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // IME 조합 중 → 무시 (compositionEnd에서 처리)
            if (isComposingRef.current) return;
            if (debounceMs > 0) {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    onSearch?.(e.target.value);
                }, debounceMs);
            }
        },
        [onSearch, debounceMs]
    );

    /** IME 조합 시작 (한글 첫 자음/모음 입력 시) → debounce 검색 차단 */
    const handleCompositionStart = useCallback(() => {
        isComposingRef.current = true;
    }, []);

    /**
     * IME 조합 완료 (한글 단어 완성 시) → 이 시점에 debounce 검색 1회 시작
     * debounceMs=0이면 즉시 실행
     */
    const handleCompositionEnd = useCallback(
        (e: React.CompositionEvent<HTMLInputElement>) => {
            isComposingRef.current = false;
            const value = (e.target as HTMLInputElement).value;
            if (debounceMs > 0) {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    onSearch?.(value);
                }, debounceMs);
            } else {
                onSearch?.(value);
            }
        },
        [onSearch, debounceMs]
    );

    return (
        <Search
            allowClear
            onSearch={handleSearch}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            {...rest}
        />
    );
};

export default CustomSearchBar;
