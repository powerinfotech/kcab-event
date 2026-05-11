import React, { useEffect, useMemo, useState } from 'react';
import CustomPagination from '@component/navigation/CustomPagination';

const PAGE_SIZE_OPTIONS = [10, 30, 50];
const DEFAULT_PAGE_SIZE = 10;

interface GridPaginationState<T> {
  currentPage: number;
  pageSize: number;
  total: number;
  pageStart: number;
  pageEnd: number;
  pagedItems: T[];
  onPageChange: (page: number, pageSize?: number) => void;
}

interface AdminGridPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  pageStart: number;
  pageEnd: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

export function useClientGridPagination<T>(items: T[]): GridPaginationState<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const total = items.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, maxPage]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  const onPageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
      setCurrentPage(1);
      return;
    }
    setCurrentPage(page);
  };

  const pageStart = total === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const pageEnd = Math.min(currentPage * pageSize, total);

  return {
    currentPage,
    pageSize,
    total,
    pageStart,
    pageEnd,
    pagedItems,
    onPageChange,
  };
}

export default function AdminGridPagination({
  currentPage,
  pageSize,
  total,
  pageStart,
  pageEnd,
  onPageChange,
}: AdminGridPaginationProps) {
  return (
    <div className="saf-table-footer saf-grid-pagination">
      <span>{total > 0 ? `${pageStart}-${pageEnd} of ${total} record(s)` : '0 record(s)'}</span>
      <div className="saf-grid-pagination-controls">
        <label>
          <span>Rows</span>
          <select value={pageSize} onChange={(event) => onPageChange(1, Number(event.target.value))}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <CustomPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showLessItems
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
