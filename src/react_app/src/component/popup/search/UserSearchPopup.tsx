/**
 * UserSearchPopup - 사용자 ID/이름 검색 팝업 컴포넌트
 *
 * [목적]
 * 사용자를 검색하여 선택하는 공통 팝업이다.
 * ID/사용자명 검색, 미사용자 제외 필터, 더블클릭 즉시 선택을 지원한다.
 *
 * @param open     - 팝업 표시 여부
 * @param onClose  - 팝업 닫기 콜백
 * @param onSelect - 사용자 선택 시 UserSearchResult 전달 콜백
 *
 * [동작 방식]
 * 1. open=true 시 전체 사용자 목록 초기 조회 (미사용자 제외 기본)
 * 2. ID/사용자명으로 검색 → callSearchUsers API 호출
 * 3. 행 클릭으로 선택 후 확인 버튼, 또는 행 더블클릭으로 즉시 선택
 *
 * [사용 방법]
 * @example
 * import UserSearchPopup from '@component/popup/search/UserSearchPopup';
 *
 * const [popupOpen, setPopupOpen] = useState(false);
 * const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
 *
 * <CustomButton onClick={() => setPopupOpen(true)}>사용자 선택</CustomButton>
 * <span>{selectedUser?.userName}</span>
 *
 * <UserSearchPopup
 *   open={popupOpen}
 *   onClose={() => setPopupOpen(false)}
 *   onSelect={(user) => {
 *     setSelectedUser(user);
 *     setPopupOpen(false);
 *   }}
 * />
 *
 * // 폼 입력 필드와 연동 → UserSearchInput 컴포넌트 사용 권장
 */
import React, {useEffect, useState} from 'react';
import type { TableColumnsType } from 'antd';
import {HttpStatusCode} from 'axios';
import CustomInput from '@component/input/CustomInput';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomButton from '@component/button/CustomButton';
import CustomTable from '@component/display/CustomTable';
import CustomSearchPopup from '@component/popup/CustomSearchPopup';
import {UserSearchResult} from '@interface/auth/AuthManagement';
import {callSearchUsers} from '@api/auth/AuthManagementApi';

const USER_POPUP_COLUMNS: TableColumnsType<UserSearchResult> = [
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
        onSelect(record);
        onClose();
    };

    return (
        <CustomSearchPopup
            title="사용자 팝업"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            tableTitle="사용자 ID 조회내역"
            totalCount={userSearchList.length}
            searchSection={
                <form>
                    <span>ID/사용자명</span>
                    <CustomInput value={userSearchText} className="w180"
                        onChange={(e) => setUserSearchText(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); }}/>
                    <CustomCheckbox checked={excludeUnused} onChange={(e) => setExcludeUnused(e.target.checked)}/>
                    <span>미사용자 제외</span>
                    <CustomButton type="primary" size="small" onClick={handleSearch} className="ml-auto">조회</CustomButton>
                </form>
            }
        >
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
        </CustomSearchPopup>
    );
};

export default UserSearchPopup;
