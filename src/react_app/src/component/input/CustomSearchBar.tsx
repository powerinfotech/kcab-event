/**
 * CustomSearchBar - 디바운스 내장 검색 입력 컴포넌트
 *
 * [목적]
 * Ant Design Input.Search를 래핑하여 타이핑 중 디바운스(기본 300ms)를 적용한다.
 * 검색 버튼 클릭 시에는 즉시 onSearch가 호출되고,
 * 타이핑 중에는 debounceMs 이후 onSearch가 호출된다.
 *
 * @param onSearch   - 검색어 전달 콜백 (string)
 * @param debounceMs - 타이핑 디바운스 대기 시간 ms (기본: 300, 0이면 디바운스 없음)
 *
 * [사용 방법]
 * @example
 * import CustomSearchBar from '@component/input/CustomSearchBar';
 *
 * // 기본 (300ms 디바운스)
 * <CustomSearchBar
 *   placeholder="검색어 입력"
 *   onSearch={(value) => fetchData(value)}
 * />
 *
 * // 디바운스 없음 (버튼 클릭 시에만 검색)
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

  const handleSearch = useCallback(
    (value: string) => {
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (debounceMs > 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onSearch?.(e.target.value);
        }, debounceMs);
      }
    },
    [onSearch, debounceMs]
  );

  return (
    <Search
      allowClear
      onSearch={handleSearch}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default CustomSearchBar;
