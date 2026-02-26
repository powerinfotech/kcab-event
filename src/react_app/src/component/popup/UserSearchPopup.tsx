import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {HttpStatusCode} from 'axios';
import CustomInput from '@component/CustomInput';
import CustomCheckbox from '@component/CustomCheckbox';
import CustomButton from '@component/CustomButton';
import CustomTable from '@component/CustomTable';
import IconTitle from '@icon/IconTitle';
import {UserSearchResult} from '@interface/auth/AuthManagement';
import {callSearchUsers} from '@api/auth/AuthManagementApi';

const USER_POPUP_COLUMNS: ColumnsType<UserSearchResult> = [
    {title: '사용자 ID', key: 'userId', dataIndex: 'userId', align: 'center', width: '50%'},
    {title: '사용자명', key: 'userName', dataIndex: 'userName', align: 'center', width: '50%'},
];

export interface UserSearchPopupProps {
    open: boolean;
    onClose: () => void;
    onSelect: (user: UserSearchResult) => void;
}

const UserSearchPopup = ({open, onClose, onSelect}: UserSearchPopupProps) => {
    const [userSearchList, setUserSearchList] = useState<UserSearchResult[]>([]);
    const [userSearchText, setUserSearchText] = useState('');
    const [excludeUnused, setExcludeUnused] = useState(true);
    const [selectedUserRowIndex, setSelectedUserRowIndex] = useState(-1);

    useEffect(() => {
        if (open) {
            setUserSearchText('');
            setExcludeUnused(true);
            setSelectedUserRowIndex(-1);
            callSearchUsers('', true).then(res => {
                if (res.code === HttpStatusCode.Ok) setUserSearchList(res.item);
            });
        }
    }, [open]);

    const handleSearch = () => {
        callSearchUsers(userSearchText, excludeUnused).then(res => {
            if (res.code === HttpStatusCode.Ok) setUserSearchList(res.item);
        });
    };

    const handleOk = () => {
        if (selectedUserRowIndex >= 0 && userSearchList[selectedUserRowIndex]) {
            onSelect(userSearchList[selectedUserRowIndex]);
        }
        onClose();
    };

    const handleDoubleClick = (record: UserSearchResult) => {
        console.log(1);
        onSelect(record);
        onClose();
    };

    return (
        <Modal title="사용자 팝업" open={open} onOk={handleOk}
            onCancel={onClose} width={650} okText="확인" cancelText="취소"
            maskClosable={false}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                <span>ID/사용자명</span>
                <CustomInput value={userSearchText} style={{width: 180}}
                    onChange={(e) => setUserSearchText(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}/>
                <CustomCheckbox checked={excludeUnused} onChange={(e) => setExcludeUnused(e.target.checked)}/>
                <span>미사용자 제외</span>
                <CustomButton type="primary" size="small" onClick={handleSearch}>조회</CustomButton>
            </div>
            <div className="board-title-wrap" style={{marginBottom: '4px'}}>
                <h3 className="title" style={{fontSize: '13px'}}><IconTitle/>사용자 ID 조회내역</h3>
                <span className="total-count">Total {userSearchList.length}</span>
            </div>
            <CustomTable
                onRow={(record: any, index?: number) => ({
                    onClick: () => setSelectedUserRowIndex(index ?? -1),
                    onDoubleClick: () => handleDoubleClick(record),
                })}
                rowKey={'userSeq'} pagination={false} rowNoFlag={true} rowSelectedFlag={true}
                columns={USER_POPUP_COLUMNS} dataSource={userSearchList}
                selectedRowIndex={selectedUserRowIndex}
                scroll={{y: 300}}
            />
        </Modal>
    );
};

export default UserSearchPopup;
