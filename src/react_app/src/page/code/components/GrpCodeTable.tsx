import React, {useState} from 'react';
import type {TableColumnsType} from 'antd';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomCard from '@component/display/CustomCard';
import CustomModal from '@component/feedback/CustomModal';
import IconTitle from '@icon/IconTitle';
import {ComGrpCdList} from '@interface/code/CommonGroupCode';
import GrpCodeDetailForm from './GrpCodeDetailForm';

interface GrpCodeTableProps {
    dataSource: ComGrpCdList[];
    columns: TableColumnsType<ComGrpCdList>;
    selectedRowIndex?: number;
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onRowClick: (record: ComGrpCdList, index: number) => void;
    onAddRow: () => void;
    onDeleteRow: () => void;
    selectedGrpCd: ComGrpCdList | null;
    onDetailChange: (field: string, value: string) => void;
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
    selectedGrpCd,
    onDetailChange,
}) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    return (
        <>
            <CustomCard className="auth-section-card" bordered={false}>
                <div className="board-title-wrap">
                    <h3 className="title">
                        <IconTitle/>그룹코드목록
                        <span className="total-count">{dataSource.length}건</span>
                    </h3>
                    <div className="box-btn">
                        <CustomButton type="default" size="small" onClick={() => setIsDetailOpen(true)} disabled={!selectedGrpCd}>그룹상세</CustomButton>
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
                                disabled: record.comGrpCdSeq > 0,
                                style: record.comGrpCdSeq > 0 ? {display: 'none'} : undefined,
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

            <CustomModal
                title="그룹상세"
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                width={500}
                destroyOnHidden
            >
                <GrpCodeDetailForm
                    selectedGrpCd={selectedGrpCd}
                    onDetailChange={onDetailChange}
                />
            </CustomModal>
        </>
    );
};

export default GrpCodeTable;
