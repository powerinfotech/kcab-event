import axios from 'axios';
import {ChangePassword, UserList, UserListSearchParam} from '@interface/master/UserManagement';
import {ApiResponse} from '@interface/common';

export const callGetUserList = async (param: UserListSearchParam) => {
    const {data} = await axios.get<ApiResponse<UserList[]>>('/api/user-mgt/user-list', {params: param});
    return data;
};

export const callSaveUser = async (param: UserList | undefined) => {
    const {data} = await axios.post<ApiResponse<UserList>>('/api/user-mgt/save-user', param);
    return data;
};

export const callDeleteUser = async (userSeq: number) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/user-mgt/delete-user', {userSeq});
    return data;
};

export const callChangePassword = async (param: ChangePassword | undefined) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/user-mgt/change-password', param);
    return data;
};
