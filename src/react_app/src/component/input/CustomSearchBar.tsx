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
