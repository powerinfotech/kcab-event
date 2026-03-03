import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthMenuBtnItem, AuthMenuMgtAuth} from '@interface/auth/AuthMenuManagement';

export const callGetUserAuthList = async (userId: string) => {
    const {data} = await axios.get<ApiResponse<AuthMenuMgtAuth[]>>('/api/user-menu-auth/auth-list', {
        params: {userId}
    });
    return data;
};

export const callGetUserAllAuthMenuBtnList = async (userId: string) => {
    const {data} = await axios.get<ApiResponse<AuthMenuBtnItem[]>>('/api/user-menu-auth/all-menu-btn-list', {
        params: {userId}
    });
    return data;
};
