import React from 'react';
import {UseFormReturn} from 'react-hook-form';
import type { TableColumnsType } from 'antd';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomButton from '@component/button/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/display/CustomTable';
import CustomCard from '@component/display/CustomCard';
import EditableFormCell from '@component/special/EditableFormCell';
import IconTitle from '@icon/IconTitle';
import {AuthGrpList} from '@interface/auth/AuthManagement';

interface AuthGroupTableProps {
    dataSource: AuthGrpList[];
    selectedRowIndex: number;
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onRowClick: (record: AuthGrpList, index: number) => void;
    onAddRow: () => void;
    onDeleteRow: () => void;
    onDataChange: (record: AuthGrpList, key: string, value: any) => void;
    form: UseFormReturn<any>;
}

const AuthGroupTable: React.FC<AuthGroupTableProps> = ({
    dataSource,
    selectedRowIndex,
    selectedRowKeys,
    onSelectedRowKeysChange,
    onRowClick,
    onAddRow,
    onDeleteRow,
    onDataChange,
    form,
}) => {
    const {register, control, setValue} = form;

    const columns: TableColumnsType<AuthGrpList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한그룹명<em>*</em></span>,
            key: 'authGrpNm', dataIndex: 'authGrpNm', align: 'center', width: '25%',
            render: (value: string, record: AuthGrpList) => {
                if (record.rgstUserSeq && record.useYn !== 'Y') return value;
                return <EditableFormCell record={record} seqField="authGrpSeq" fieldSuffix="authGrpNm"
                    value={value} setValue={setValue} control={control} register={register}
                    onDataChange={onDataChange} requiredMessage="권한그룹명은 필수입력입니다."
                    maxLength={100} regExp={{value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/, message: '권한그룹명은 한글,영문,숫자만 입력가능합니다.'}}/>;
            },
        },
        {
            title: '설명', key: 'authGrpExpl', dataIndex: 'authGrpExpl', align: 'center', width: '40%',
            render: (value: string, record: AuthGrpList) =>
                record.rgstUserSeq && record.useYn !== 'Y' ? value :
                    <CustomInput name={`${record.authGrpSeq}_authGrpExpl`} value={value} maxLength={200}
                        onChange={(e) => onDataChange(record, 'authGrpExpl', e.target.value)}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string, record: AuthGrpList) =>
                <CustomCheckbox name={`${record.authGrpSeq}_useYn`} checked={value === 'Y'}
                    onChange={(e) => onDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
    ];

    return (
        <CustomCard className="auth-mgmt-left auth-section-card auth-section-card--group" bordered={false}>
            <div className="board-title-wrap">
                <h3 className="title"><IconTitle/>권한그룹정보<span className="total-count">{dataSource.length}건</span></h3>
                <div className="box-btn">
                    <CustomButton type="default" size="small" onClick={onAddRow}>+ 행추가</CustomButton>
                    <CustomButton type="default" size="small" onClick={onDeleteRow}>- 행삭제</CustomButton>
                </div>
            </div>
            <div className="board-cont-wrap">
                <CustomTable
                    onRow={(record: any, index?: number) => ({
                        onClick: () => {
                            if (index !== selectedRowIndex) onRowClick(record, index ?? -1);
                        },
                    })}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys: React.Key[]) => onSelectedRowKeysChange(keys),
                    }}
                    rowKey={'authGrpSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                    columns={columns} dataSource={dataSource}
                    selectedRowIndex={selectedRowIndex}
                />
            </div>
        </CustomCard>
    );
};

export default AuthGroupTable;
