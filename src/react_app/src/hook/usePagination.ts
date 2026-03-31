import { useState, useCallback, useRef } from 'react';
import { ApiResponse } from '@interface/common';

interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
}

interface PaginationParams {
    pageNo: number;
    pageSize: number;
}

interface UsePaginationOptions {
    defaultPageSize?: number;
    defaultCurrent?: number;
}

interface UsePaginationReturn<T, P> {
    dataSource: T[];
    pagination: PaginationState;
    loading: boolean;
    /** 현재 페이지 조건으로 재조회 */
    reload: () => void;
    /** 검색 조건 변경 시 1페이지로 이동하여 조회 */
    search: (params?: P) => void;
    /** 페이지 변경 핸들러 (CustomTable onChange에 연결) */
    onPageChange: (page: number, pageSize: number) => void;
    /** 데이터 직접 설정 (로컬 수정 시) */
    setDataSource: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * 테이블 페이지네이션 로직 분리 훅
 * @example
 * const { dataSource, pagination, loading, search, onPageChange } = usePagination(
 *   (params) => callGetUserList(params),
 *   { defaultPageSize: 20 }
 * );
 */
export function usePagination<T, P extends Record<string, any> = Record<string, any>>(
    fetchFn: (params: P & PaginationParams) => Promise<ApiResponse<{ list: T[]; totalCount: number }>>,
    options?: UsePaginationOptions
): UsePaginationReturn<T, P> {
    const { defaultPageSize = 10, defaultCurrent = 1 } = options ?? {};

    const [dataSource, setDataSource] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        current: defaultCurrent,
        pageSize: defaultPageSize,
        total: 0,
    });

    const searchParamsRef = useRef<P>({} as P);

    const fetchData = useCallback(
        async (pageNo: number, pageSize: number) => {
            setLoading(true);
            try {
                const params = Object.assign(
                    {}, searchParamsRef.current, { pageNo, pageSize }
                ) as P & PaginationParams;
                const response = await fetchFn(params);
                const { list, totalCount } = response.item;
                setDataSource(list ?? []);
                setPagination((prev) => ({
                    ...prev,
                    current: pageNo,
                    pageSize,
                    total: totalCount ?? 0,
                }));
            } catch {
                setDataSource([]);
            } finally {
                setLoading(false);
            }
        },
        [fetchFn]
    );

    const reload = useCallback(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [fetchData, pagination.current, pagination.pageSize]);

    const search = useCallback(
        (params?: P) => {
            if (params) searchParamsRef.current = params;
            fetchData(1, pagination.pageSize);
        },
        [fetchData, pagination.pageSize]
    );

    const onPageChange = useCallback(
        (page: number, pageSize: number) => {
            fetchData(page, pageSize);
        },
        [fetchData]
    );

    return {
        dataSource,
        pagination,
        loading,
        reload,
        search,
        onPageChange,
        setDataSource,
    };
}
