import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthGroupMenuList, AuthGroupMenuTree} from '@interface/auth/AuthGroupMenuManagement';


export const callGetAuthGroupMenuList = async (authGrpSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthGroupMenuList[]>>('/api/auth-group-menu-mgt/auth-group-menu-list',{params: {authGrpSeq:authGrpSeq}});
    return data;
};

export const callSaveAuthGroupMenu = async (authGroupMenuTree:AuthGroupMenuTree, authGrpSeq:number|undefined) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/auth-group-menu-mgt/save',{authGroupMenuSaveDto:authGroupMenuTree, authGrpSeq:authGrpSeq});
    return data;
};
