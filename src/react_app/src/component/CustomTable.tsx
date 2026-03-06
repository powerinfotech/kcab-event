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

        return <></>;
    }
};

const CustomTable = (props: CustomTableProps) => {
    const targetPagination = props.pagination ?? false;
    const [targetDataSource, setTargetDataSource] = useState<any>();
    const [paginationParam, setPaginationParam] = useState<CustomPageParam>({
        page: targetPagination && targetPagination.current ? targetPagination.current : 0,
        pageSize: targetPagination && targetPagination.pageSize ? targetPagination.pageSize : 0,
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
    }, [props.dataSource, paginationParam.pageEditFlag, props.rowNoFlag]);

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
