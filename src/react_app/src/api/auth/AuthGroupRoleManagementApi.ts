import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthGroupRoleList} from '@interface/auth/AuthGroupRoleManagement';


export const callGetAuthGroupRoleList = async (authGrpSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthGroupRoleList[]>>('/api/auth-group-role-mgt/auth-group-role-list',{params: {authGrpSeq:authGrpSeq}});
    return data;
};

export const callSaveAuthGroupRole = async (authGroupRoleList:AuthGroupRoleList[]) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/auth-group-role-mgt/save',{authGroupRoleList:authGroupRoleList});
    return data;
};
