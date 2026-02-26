import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthGrpList, AuthInfoList, AuthUserInfoList, UserSearchResult, AuthManagementSaveData} from '@interface/auth/AuthManagement';

export const callGetAuthGrpList = async () => {
    const {data} = await axios.get<ApiResponse<AuthGrpList[]>>('/api/auth-mgt/auth-grp-list');
    return data;
};

export const callGetAuthList = async (authGrpSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthInfoList[]>>('/api/auth-mgt/auth-list', {params: {authGrpSeq}});
    return data;
};

export const callGetAuthUserList = async (authGrpSeq: number, authSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthUserInfoList[]>>('/api/auth-mgt/auth-user-list', {params: {authGrpSeq, authSeq}});
    return data;
};

export const callSearchUsers = async (searchText: string, excludeUnused: boolean) => {
    const {data} = await axios.get<ApiResponse<UserSearchResult[]>>('/api/auth-mgt/user-search', {params: {searchText, excludeUnused}});
    return data;
};

export const callSaveAuthManagement = async (saveData: AuthManagementSaveData) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/auth-mgt/save', saveData);
    return data;
};
