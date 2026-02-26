import React, {useEffect, useState} from 'react';

import {Table, TableProps} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {IudType} from '@interface/common';

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
        width: '45px',
    }
];

export const iudColums:ColumnsType = [
    {
        title: () => {
            return <EditOutlined />;
        },
        dataIndex: 'iudType',
        key: 'iudType',
        align: 'center',
        width: '40px',
        render: (value:IudType) => {
            if(value === IudType.I)
                return <PlusCircleOutlined />;
            if(value === IudType.U)
                return <CheckCircleOutlined />;
            if(value === IudType.D)
                return <DeleteOutlined />;

            return <></>;
        }
    }
];

export const    IUD_COLUMN = iudColums[0];

const CustomTable = (props: CustomTableProps) => {
    const targetPagination = props.pagination ?? false;
    let targetColumns = props.columns;
    const [targetDataSource, setTargetDataSource] = useState<any>();
    const [paginationParam, setPaginationParam] = useState<CustomPageParam>({
        page: targetPagination && targetPagination.current ? targetPagination.current : 0,
        pageSize: targetPagination && targetPagination.pageSize ? targetPagination.pageSize : 0,
        pageEditFlag: true,
    });
    const [tableHeight, setTableHeight] = useState(800);
    const [selectRowIndex, setSelectRowIndex] = useState<number | undefined>(0);

    const setClassName = (record:any, index:number) => {
       return index === props.selectedRowIndex ? 'selected-row' : '';
    };


    const setSelectedClassName = (record:any, index:number) => {
        if (props.selectedRowIndex !== undefined) {
            return index === props.selectedRowIndex ? 'selected-row' : '';
        }
        return index === selectRowIndex ? 'selected-row' : '';
    };

    useEffect(() => {
        if (props.rowNoFlag === true && paginationParam.pageEditFlag && props.dataSource && props.dataSource.length > 0) {
            const array = [
                ...props.dataSource.map((item: any, idx: number) => {
                    item['rowNo'] = (paginationParam.page - 1) * paginationParam.pageSize + (idx + 1);
                    return item;
                }),
            ];
            setTargetDataSource(array);
            setPaginationParam({ ...paginationParam });
        } else if (props.rowNoDescFlag === true && paginationParam.pageEditFlag && props.dataSource && props.dataSource.length > 0) {
            let array:any[] = [];
            if (props.pagination && (props.pagination as any).total) {
                const totalCnt = (props.pagination as any).total;
                array = [
                    ...props.dataSource.map((item: any, idx: number) => {
                        item['rowNo'] = (totalCnt + 1) - ((paginationParam.page - 1) * paginationParam.pageSize + (idx + 1));
                        return item;
                    }),
                ];
            } else {
                const totalCnt = props.dataSource.length;
                array = [
                    ...props.dataSource.map((item: any, idx: number) => {
                        item['rowNo'] = (totalCnt + 1) - ((paginationParam.page - 1) * paginationParam.pageSize + (idx + 1));
                        return item;
                    }),
                ];
            }
            setTargetDataSource(array);
            setPaginationParam({ ...paginationParam });
        } else {
            setTargetDataSource(props.dataSource);
        }
    }, [props.dataSource, paginationParam.pageEditFlag, props.rowNoFlag]);


    // useEffect(() => {
        if (props.rowNoFlag === true || props.rowNoDescFlag === true) {
            if (targetColumns !== undefined) {


                if (!targetColumns?.map((item) => { return item.key;}).includes('rowNo')) {
                    targetColumns = rowNoColumns.concat(targetColumns);
                }
            }
        }

    // }, [props.dataSource, paginationParam.pageEditFlag, props.rowNoFlag, props.columns]);

    useEffect(() => {
        const handleResize = () => {
          const windowHeight = window.innerHeight;
          const availableHeight = windowHeight * 0.55;
          setTableHeight(availableHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Table
                {...props}
                scroll={props.scroll??{y:tableHeight}}
                onRow={(record,index) => ({
                    ...props.onRow,
                    onClick: async () => {
                        if (props.onRow && (props.onRow?.(record,index) as any).onClick) {
                            const result = await (props.onRow?.(record, index) as any).onClick();

                            if (result !== false &&  props.rowSelectedFlag) {
                                setSelectRowIndex(index);
                            }
                        } else if (props.rowSelectedFlag){
                            setSelectRowIndex(index);
                        }

                    },
                })}
                dropdownPrefixCls={props.dropdownPrefixCls}
                components={props.components}
                columns={targetColumns}
                dataSource={targetDataSource}
                pagination={targetPagination}
                loading={props.loading}
                size={props.size}
                rowKey={props.rowKey}
                bordered={props.bordered}
                locale={props.locale}
                rootClassName={props.rootClassName}
                onChange={(pagination, filters, sorter, extra) => {
                    setPaginationParam({
                        page: pagination.current ? pagination.current : 0,
                        pageSize: pagination.pageSize ? pagination.pageSize : 0,
                        pageEditFlag: true,
                    });
                    if (props?.onChange) props?.onChange(pagination, filters, sorter, extra);
                }}
                rowSelection={props.rowSelection}
                getPopupContainer={props.getPopupContainer}
                sortDirections={props.sortDirections}
                showSorterTooltip={props.showSorterTooltip}
                virtual={props.virtual}
                rowClassName={(record, index, indent) => props.rowSelectedFlag?setSelectedClassName(record, index):setClassName(record, index)}
            >
                {props.children}
            </Table>
        </>
    );
};

export default CustomTable;
