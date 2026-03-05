import React, {useState} from 'react';
import {Button, Input} from 'antd';
import IconBtnSearch from '@icon/IconBtnSearch';
import UserSearchPopup from '@component/popup/UserSearchPopup';
import {UserSearchResult} from '@interface/auth/AuthManagement';

export interface UserSearchInputProps {
    value: string;
    onChange: (user: UserSearchResult) => void;
    placeholder?: string;
    width?: number;
}

const UserSearchInput = ({value, onChange, placeholder = '사용자를 선택해 주세요.', width = 200}: UserSearchInputProps) => {
    const [popupOpen, setPopupOpen] = useState(false);

    const handleSelect = (user: UserSearchResult) => {
        onChange(user);
    };

    return (
        <>
            <span style={{display: 'inline-flex', alignItems: 'center'}}>
                <Input
                    readOnly
                    value={value}
                    placeholder={placeholder}
                    style={{width, borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                />
                <Button
                    type="primary"
                    onClick={() => setPopupOpen(true)}
                    style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1}}
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
