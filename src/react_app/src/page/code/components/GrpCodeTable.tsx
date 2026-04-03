import React from 'react';
import type {TableColumnsType} from 'antd';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomCard from '@component/display/CustomCard';
import IconTitle from '@icon/IconTitle';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';

interface GrpCodeTableProps {
    dataSource: ComGrpCdList[];
    columns: TableColumnsType<ComGrpCdList>;
    selectedRowIndex?: number;
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onRowClick: (record: ComGrpCdList, index: number) => void;
    onAddRow: () => void;
    onDeleteRow: () => void;
}

const GrpCodeTable: React.FC<GrpCodeTableProps> = ({
    dataSource,
    columns,
    selectedRowIndex,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onRowClick,
    onAddRow,
    onDeleteRow,
}) => {
    return (
        <CustomCard className="auth-section-card" bordered={false}>
            <div className="board-title-wrap">
                <h3 className="title">
                    <IconTitle/>공통그룹코드목록
                    <span className="total-count">{dataSource.length}건</span>
                </h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onAddRow}>+행추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={onDeleteRow}>-행삭제</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                <CustomTable
                    onRow={(record: any, index?: number) => ({
                        onClick: () => onRowClick(record, index ?? -1),
                    })}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys: React.Key[]) => onSelectedRowKeysChange(keys),
                        getCheckboxProps: (record: any) => ({
                            disabled: !!record.rgstUserSeq,
                            style: record.rgstUserSeq ? {display: 'none'} : undefined,
                        }),
                    }}
                    rowKey={'comGrpCdSeq'}
                    pagination={false}
                    rowNoFlag={true}
                    rowSelectedFlag={true}
                    selectedRowIndex={selectedRowIndex}
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
        </CustomCard>
    );
};

export default GrpCodeTable;
