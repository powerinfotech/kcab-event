import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {RoleList, RoleUserList} from '@interface/auth/RoleManagement';


export const callGetRoleList = async () => {
    const {data} = await axios.get<ApiResponse<RoleList[]>>('/api/role-mgt/role-list');
    return data;
};

export const callGetRoleUserList = async (roleSeq: number) => {
    const {data} = await axios.get<ApiResponse<RoleUserList[]>>('/api/role-mgt/role-user-list',{params: {roleSeq:roleSeq}});
    return data;
};

export const callSaveRole = async (roleList:RoleList[], roleUserList:RoleUserList[]) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/role-mgt/save',{roleList:roleList, roleUserList: roleUserList});
    return data;
};
