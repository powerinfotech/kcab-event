import React from 'react';
import {UseFormReturn} from 'react-hook-form';
import {ColumnsType} from 'antd/es/table';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomButton from '@component/button/CustomButton';
import CustomTable, {IUD_COLUMN} from '@component/display/CustomTable';
import EditableFormCell from '@component/special/EditableFormCell';
import IconTitle from '@icon/IconTitle';
import {AuthInfoList} from '@interface/auth/AuthManagement';

interface AuthTableProps {
    dataSource: AuthInfoList[];
    selectedRowIndex: number;
    selectedRowKeys: React.Key[];
    onSelectedRowKeysChange: (keys: React.Key[]) => void;
    onRowClick: (record: AuthInfoList, index: number) => void;
    onAddRow: () => void;
    onDeleteRow: () => void;
    onDataChange: (record: AuthInfoList, key: string, value: any) => void;
    form: UseFormReturn<any>;
}

const AuthTable: React.FC<AuthTableProps> = ({
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

    const columns: ColumnsType<AuthInfoList> = [
        IUD_COLUMN,
        {
            title: <span className="tit">권한명<em>*</em></span>,
            key: 'authNm', dataIndex: 'authNm', align: 'center', width: '50%',
            render: (value: string, record: AuthInfoList) =>
                <EditableFormCell record={record} seqField="authSeq" fieldSuffix="authNm"
                    value={value} setValue={setValue} control={control} register={register}
                    onDataChange={onDataChange} requiredMessage="권한명은 필수입력입니다." maxLength={100}/>,
        },
        {
            title: '권한설명', key: 'authExpl', dataIndex: 'authExpl', align: 'center', width: '50%',
            render: (value: string, record: AuthInfoList) =>
                <CustomInput value={value} maxLength={2000}
                    onChange={(e) => onDataChange(record, 'authExpl', e.target.value)}/>,
        },
        {
            title: '사용여부', key: 'useYn', dataIndex: 'useYn', align: 'center', width: 80,
            render: (value: string, record: AuthInfoList) =>
                <CustomCheckbox checked={value === 'Y'}
                    onChange={(e) => onDataChange(record, 'useYn', e.target.checked ? 'Y' : 'N')}/>,
        },
    ];

    return (
        <div>
            <div className="board-title-wrap">
                <h3 className="title"><IconTitle/>권한정보<span className="total-count">{dataSource.length}건</span></h3>
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
                    rowKey={'authSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                    columns={columns} dataSource={dataSource}
                    selectedRowIndex={selectedRowIndex}
                />
            </div>
        </div>
    );
};

export default AuthTable;
