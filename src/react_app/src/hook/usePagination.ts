/**
 * usePagination - 테이블 페이지네이션 로직 분리 훅
 *
 * [목적]
 * 목록 조회 페이지에서 반복되는 패턴(데이터 조회, 페이지 변경, 로딩 처리)을
 * 하나의 훅으로 통합한다. API 호출 함수만 전달하면 페이징이 자동 처리된다.
 *
 * [사용 방법]
 * @example
 * // 1. API 함수 전달하여 훅 생성
 * const { dataSource, pagination, loading, search, reload, onPageChange } = usePagination(
 *   (params) => callGetUserList(params),
 *   { defaultPageSize: 20 }
 * );
 *
 * // 2. 조회 버튼 → search에 검색 조건 전달 (1페이지로 이동)
 * const handleSearch = () => {
 *   search({ userName: searchText, statusCd: selectedStatus });
 * };
 *
 * // 3. 저장 후 현재 페이지 재조회
 * const handleSave = async () => {
 *   await callSaveUser(data);
 *   reload();
 * };
 *
 * // 4. 테이블에 연결
 * <CustomTable
 *   dataSource={dataSource}
 *   loading={loading}
 *   pagination={{
 *     current: pagination.current,
 *     pageSize: pagination.pageSize,
 *     total: pagination.total,
 *     onChange: onPageChange,
 *   }}
 * />
 */
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
