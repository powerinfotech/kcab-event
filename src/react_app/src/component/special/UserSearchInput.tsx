/**
 * UserSearchInput - 사용자 검색 버튼 포함 입력 컴포넌트
 *
 * [목적]
 * 읽기 전용 Input과 검색 버튼을 조합하여 사용자를 선택하는 입력 필드를 제공한다.
 * 클릭 또는 버튼 클릭 시 UserSearchPopup이 열리고, 선택된 사용자 정보를 onChange로 전달한다.
 *
 * @param value       - 현재 표시되는 사용자명 또는 ID
 * @param onChange    - 사용자 선택 시 UserSearchResult 전달 콜백
 * @param placeholder - 입력 필드 플레이스홀더 (기본: '사용자를 선택해 주세요.')
 *
 * [사용 방법]
 * @example
 * import UserSearchInput from '@component/special/UserSearchInput';
 *
 * const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
 *
 * <UserSearchInput
 *   value={selectedUser?.userName ?? ''}
 *   onChange={(user) => {
 *     setSelectedUser(user);
 *     setValue('userId', user.userId); // react-hook-form 연동 시
 *   }}
 * />
 *
 * // react-hook-form 폼 내에서 사용 시
 * <Controller
 *   name="assignee"
 *   control={control}
 *   render={({ field }) => (
 *     <UserSearchInput
 *       value={field.value?.userName ?? ''}
 *       onChange={(user) => field.onChange(user)}
 *     />
 *   )}
 * />
 */
import React, {useState} from 'react';
import {Button, Input} from 'antd';
import IconBtnSearch from '@icon/IconBtnSearch';
import UserSearchPopup from '@component/popup/search/UserSearchPopup';
import {UserSearchResult} from '@interface/auth/AuthManagement';

export interface UserSearchInputProps {
    value: string;
    onChange: (user: UserSearchResult) => void;
    placeholder?: string;
}

const UserSearchInput = ({value, onChange, placeholder = '사용자를 선택해 주세요.'}: UserSearchInputProps) => {
    const [popupOpen, setPopupOpen] = useState(false);

    const handleSelect = (user: UserSearchResult) => {
        onChange(user);
    };

    return (
        <>
            <span className="user-search-input">
                <Input
                    readOnly
                    value={value}
                    placeholder={placeholder}
                    onClick={() => setPopupOpen(true)}
                />
                <Button
                    type="primary"
                    onClick={() => setPopupOpen(true)}
                >
                    <IconBtnSearch />
                </Button>
            </span>
            <UserSearchPopup
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                onSelect={handleSelect}
            />
        </>
    );
};

export default UserSearchInput;
