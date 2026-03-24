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
