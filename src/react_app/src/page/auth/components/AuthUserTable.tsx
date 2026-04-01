import React from 'react';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomButton from '@component/button/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/display/CustomTable';
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
}

const AuthUserTable: React.FC<AuthUserTableProps> = ({
    dataSource,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onOpenUserPopup,
    onDeleteRow,
    onDataChange,
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
        <div>
            <div className="board-title-wrap">
                <h3 className="title"><IconTitle/>권한사용자정보<span className="total-count">{dataSource.length}건</span></h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onOpenUserPopup}>인원추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={onDeleteRow}>- 행삭제</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                <CustomTable
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys: React.Key[]) => onSelectedRowKeysChange(keys),
                    }}
                    rowKey={'authUserSeq'} pagination={false} rowNoFlag={true}
                    columns={columns} dataSource={dataSource}
                />
            </div>
        </div>
    );
};

export default AuthUserTable;
