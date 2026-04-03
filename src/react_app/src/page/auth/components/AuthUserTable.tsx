import React from 'react';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomButton from '@component/button/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/display/CustomTable';
import CustomCard from '@component/display/CustomCard';
import CustomTag from '@component/display/CustomTag';
import CustomEmpty from '@component/display/CustomEmpty';
import CustomDatePicker from '@component/date/CustomDatePicker';
import IconTitle from '@icon/IconTitle';
import {AuthUserInfoList} from '@interface/auth/AuthManagement';

interface AuthUserTableProps {
    dataSource: AuthUserInfoList[];
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onOpenUserPopup: () => void;
    onDeleteRow: () => void;
    onDataChange: (record: AuthUserInfoList, key: string, value: any) => void;
    selectedGroupName?: string;
    selectedAuthName?: string;
}

const AuthUserTable: React.FC<AuthUserTableProps> = ({
    dataSource,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onOpenUserPopup,
    onDeleteRow,
    onDataChange,
    selectedGroupName,
    selectedAuthName,
}) => {
    const columns: TableColumnsType<AuthUserInfoList> = [
        IUD_COLUMN,
        {title: '사용자ID', key: 'userId', dataIndex: 'userId', align: 'center', width: '25%'},
        {title: '사용자명', key: 'userName', dataIndex: 'userName', align: 'center', width: '25%'},
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: '80px',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => onDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
        {
            title: '시작일', key: 'strDt', dataIndex: 'strDt', align: 'center', width: '25%',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => onDataChange(record, 'strDt', date ? date.format('YYYYMMDD') : '')}
                    className="w-full"/>,
        },
        {
            title: '종료일', key: 'endDt', dataIndex: 'endDt', align: 'center', width: '25%',
            render: (value: string, record: AuthUserInfoList) =>
                <CustomDatePicker
                    value={value ? dayjs(value, 'YYYYMMDD') : null}
                    onChange={(date) => onDataChange(record, 'endDt', date ? date.format('YYYYMMDD') : '')}
                    className="w-full"/>,
        },
    ];

    return (
        <CustomCard className="auth-section-card" bordered={false}>
            <div className="board-title-wrap">
                <h3 className="title">
                    <IconTitle/>권한사용자정보
                    {selectedGroupName && <CustomTag color="gold" className="auth-context-tag">{selectedGroupName}</CustomTag>}
                    {selectedAuthName && <CustomTag color="blue" className="auth-context-tag">{selectedAuthName}</CustomTag>}
                    <span className="total-count">{dataSource.length}건</span>
                </h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onOpenUserPopup} disabled={!selectedAuthName}>인원추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={onDeleteRow} disabled={!selectedAuthName}>- 행삭제</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                {!selectedAuthName ? (
                    <div className="auth-empty-state">
                        <CustomEmpty description="상단에서 권한을 선택하면 해당 권한의 사용자 목록이 표시됩니다." />
                    </div>
                ) : (
                    <CustomTable
                        rowSelection={{
                            selectedRowKeys,
                            onChange: (keys: React.Key[]) => onSelectedRowKeysChange(keys),
                        }}
                        rowKey={'authUserSeq'} pagination={false} rowNoFlag={true}
                        columns={columns} dataSource={dataSource}
                        locale={{ emptyText: <CustomEmpty description="배정된 사용자가 없습니다. '인원추가' 버튼으로 사용자를 추가하세요." /> }}
                    />
                )}
            </div>
        </CustomCard>
    );
};

export default AuthUserTable;
