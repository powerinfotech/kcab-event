import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthMenuBtnItem, AuthMenuBtnSaveParam, AuthMenuMgtAuth} from '@interface/auth/AuthMenuManagement';

export const callGetAuthMenuMgtAuthList = async () => {
    const {data} = await axios.get<ApiResponse<AuthMenuMgtAuth[]>>('/api/auth-menu-mgt/auth-list');
    return data;
};

export const callGetAuthMenuBtnList = async (authGrpSeq: number, authSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthMenuBtnItem[]>>('/api/auth-menu-mgt/auth-menu-btn-list', {
        params: {authGrpSeq, authSeq}
    });
    return data;
};

export const callSaveAuthMenuBtn = async (param: AuthMenuBtnSaveParam) => {
    const {data} = await axios.post<ApiResponse<void>>('/api/auth-menu-mgt/save', param);
    return data;
};
