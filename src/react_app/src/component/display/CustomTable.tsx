/**
 * CustomTable - 행 번호 자동 계산 + IUD 상태 아이콘 + 선택 행 강조 테이블 컴포넌트
 *
 * [목적]
 * Ant Design Table을 래핑하여 관리자 화면에서 공통으로 필요한 기능을 추가한다.
 * 1. 행 번호(NO) 자동 계산 — 오름/내림차순 모두 지원
 * 2. IUD 상태 아이콘 표시 (+ 신규, ✓ 수정, 🗑 삭제)
 * 3. 클릭 행 배경색 강조 (selected-row 클래스)
 * 4. 창 높이에 비례한 테이블 스크롤 높이 자동 계산 (TABLE_HEIGHT_RATIO=0.55)
 *
 * [추가 Props]
 * @param rowNoFlag        - 오름차순 행 번호 표시 여부 (rowNo 컬럼 자동 추가)
 * @param rowNoDescFlag    - 내림차순 행 번호 표시 여부
 * @param showIudIcon      - IUD_COLUMN 사용 여부 (columns에 직접 포함시켜 사용)
 * @param selectedRowIndex - 외부에서 선택 행 인덱스 제어
 * @param rowSelectedFlag  - 클릭 시 행 자동 선택 여부
 *
 * [exports]
 * - default: CustomTable
 * - named:   IUD_COLUMN   (IUD 상태 아이콘 컬럼 정의 객체)
 *
 * [사용 방법]
 * @example
 * import CustomTable, { IUD_COLUMN } from '@component/display/CustomTable';
 *
 * // 행 번호 + 클릭 선택
 * <CustomTable
 *   rowNoFlag
 *   rowSelectedFlag
 *   columns={columns}
 *   dataSource={dataSource}
 *   pagination={{ current: page, pageSize: 10, total: totalCount, onChange: onPageChange }}
 *   onRow={(record) => ({ onClick: () => handleRowClick(record) })}
 * />
 *
 * // IUD 아이콘 컬럼 포함
 * const columns = [IUD_COLUMN, { title: '이름', dataIndex: 'name' }];
 * <CustomTable columns={columns} dataSource={dataSource} pagination={false} />
 *
 * // 내림차순 행 번호 (전체 건수 기준)
 * <CustomTable
 *   rowNoDescFlag
 *   columns={columns}
 *   dataSource={dataSource}
 *   pagination={{ total: totalCount, current: page, pageSize: 10 }}
 * />
 */
import React, {useEffect, useMemo, useState} from 'react';

import {Table, TableProps} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {IudType} from '@interface/common';

const TABLE_HEIGHT_RATIO = 0.55;

interface CustomTableProps extends TableProps {
    rowNoFlag?: boolean;
    rowNoDescFlag?:boolean;
    showIudIcon?:boolean;
    selectedRowIndex?:number;
    rowSelectedFlag?:boolean;
}

interface CustomPageParam {
    page: number;
    pageSize: number;
    pageEditFlag: boolean;
}

const rowNoColumns: ColumnsType = [
    {
        title: 'NO',
        dataIndex: 'rowNo',
        key: 'rowNo',
        align: 'center',
        width: '50px',
    }
];

export const IUD_COLUMN = {
    title: () => {
        return <EditOutlined />;
    },
    dataIndex: 'iudType',
    key: 'iudType',
    align: 'center' as const,
    width: '50px',
    render: (value:IudType) => {
        if(value === IudType.I)
            return <PlusCircleOutlined />;
        if(value === IudType.U)
            return <CheckCircleOutlined />;
        if(value === IudType.D)
            return <DeleteOutlined />;

        return null;
    }
};

const CustomTable = (props: CustomTableProps) => {
    const targetPagination = props.pagination ?? false;
    const [targetDataSource, setTargetDataSource] = useState<any>();
    const [paginationParam, setPaginationParam] = useState<CustomPageParam>({
        page: targetPagination && targetPagination.current ? targetPagination.current : 1,
        pageSize: targetPagination && targetPagination.pageSize ? targetPagination.pageSize : 10,
        pageEditFlag: true,
    });
    const [tableHeight, setTableHeight] = useState(800);
    const [selectRowIndex, setSelectRowIndex] = useState<number | undefined>(0);

    const getRowClassName = (_record: any, index: number) => {
        const targetIndex = props.selectedRowIndex ?? (props.rowSelectedFlag ? selectRowIndex : undefined);
        return index === targetIndex ? 'selected-row' : '';
    };

    const targetColumns = useMemo(() => {
        let cols = props.columns;
        if ((props.rowNoFlag || props.rowNoDescFlag) && cols) {
            if (!cols.map(item => item.key).includes('rowNo')) {
                cols = rowNoColumns.concat(cols);
            }
        }
        return cols;
    }, [props.columns, props.rowNoFlag, props.rowNoDescFlag]);

    useEffect(() => {
        if (props.rowNoFlag === true && paginationParam.pageEditFlag && props.dataSource && props.dataSource.length > 0) {
            const array = props.dataSource.map((item: any, idx: number) => ({
                ...item,
                rowNo: (paginationParam.page - 1) * paginationParam.pageSize + (idx + 1),
            }));
            setTargetDataSource(array);
            setPaginationParam({ ...paginationParam });
        } else if (props.rowNoDescFlag === true && paginationParam.pageEditFlag && props.dataSource && props.dataSource.length > 0) {
            let totalCnt: number;
            if (props.pagination && (props.pagination as any).total) {
                totalCnt = (props.pagination as any).total;
            } else {
                totalCnt = props.dataSource.length;
            }
            const array = props.dataSource.map((item: any, idx: number) => ({
                ...item,
                rowNo: (totalCnt + 1) - ((paginationParam.page - 1) * paginationParam.pageSize + (idx + 1)),
            }));
            setTargetDataSource(array);
            setPaginationParam({ ...paginationParam });
        } else {
            setTargetDataSource(props.dataSource);
        }
    }, [props.dataSource, paginationParam.pageEditFlag, paginationParam.page, paginationParam.pageSize, props.rowNoFlag, props.rowNoDescFlag]);

    useEffect(() => {
        const handleResize = () => {
          const windowHeight = window.innerHeight;
          const availableHeight = windowHeight * TABLE_HEIGHT_RATIO;
          setTableHeight(availableHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const targetRowSelection = useMemo(() => {
        if (!props.rowSelection) return undefined;
        return { columnWidth: 50, ...props.rowSelection };
    }, [props.rowSelection]);

    return (
        <Table
            {...props}
            rowSelection={targetRowSelection}
            scroll={props.scroll ?? {y: tableHeight}}
            onRow={(record, index) => {
                const rowProps = props.onRow?.(record, index) as any;
                return {
                    ...rowProps,
                    onClick: async () => {
                        if (rowProps?.onClick) {
                            const result = await rowProps.onClick();
                            if (result !== false && props.rowSelectedFlag) {
                                setSelectRowIndex(index);
                            }
                        } else if (props.rowSelectedFlag) {
                            setSelectRowIndex(index);
                        }
                    },
                };
            }}
            columns={targetColumns}
            dataSource={targetDataSource}
            pagination={targetPagination}
            onChange={(pagination, filters, sorter, extra) => {
                setPaginationParam({
                    page: pagination.current ? pagination.current : 0,
                    pageSize: pagination.pageSize ? pagination.pageSize : 0,
                    pageEditFlag: true,
                });
                if (props?.onChange) props?.onChange(pagination, filters, sorter, extra);
            }}
            rowClassName={(_record, index) => getRowClassName(_record, index)}
        >
            {props.children}
        </Table>
    );
};

export default CustomTable;
