import React from 'react';
import type {TableColumnsType} from 'antd';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomCard from '@component/display/CustomCard';
import CustomTag from '@component/display/CustomTag';
import CustomEmpty from '@component/display/CustomEmpty';
import IconTitle from '@icon/IconTitle';
import {ComCdList} from '@interface/code/CommonCode';

interface ComCodeTableProps {
    dataSource: ComCdList[];
    columns: TableColumnsType<ComCdList>;
    scrollX: number;
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onAddRow: () => void;
    onDeleteRow: () => void;
    selectedGrpName?: string;
}

const ComCodeTable: React.FC<ComCodeTableProps> = ({
    dataSource,
    columns,
    scrollX,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onAddRow,
    onDeleteRow,
    selectedGrpName,
}) => {
    return (
        <CustomCard className="auth-section-card" bordered={false} style={{height: '100%'}}>
            <div className="board-title-wrap">
                <h3 className="title">
                    <IconTitle/>공통코드목록
                    {selectedGrpName && <CustomTag color="blue" className="auth-context-tag">{selectedGrpName}</CustomTag>}
                    <span className="total-count">{dataSource.length}건</span>
                </h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onAddRow} disabled={!selectedGrpName}>+행추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={onDeleteRow} disabled={!selectedGrpName}>-행삭제</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                {!selectedGrpName ? (
                    <CustomEmpty description="좌측에서 그룹코드를 선택하면 공통코드 목록이 표시됩니다."/>
                ) : (
                    <CustomTable
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (keys: React.Key[]) => onSelectedRowKeysChange(keys),
                        }}
                        rowKey={'comCdSeq'}
                        pagination={false}
                        rowNoFlag={true}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{x: '100%', y: undefined}}
                    />
                )}
            </div>
        </CustomCard>
    );
};

export default ComCodeTable;
