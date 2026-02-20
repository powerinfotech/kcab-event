import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {UserMenuAuthGroupList, UserMenuAuthUserComboList} from '@interface/auth/UserMenuAuthState';
import {AuthGroupMenuTree} from '@interface/auth/AuthGroupMenuManagement';


export const callGetUserMenuAuthGroupList = async (userSeq:number) => {
    const {data} = await axios.get<ApiResponse<UserMenuAuthGroupList[]>>(`/api/user-menu-auth-state/auth-group-list?userSeq=${userSeq}`);
    return data;
};


export const callGetUserMenuAuthMenuList = async (authGrpSeq: number) => {
    const {data} = await axios.get<ApiResponse<AuthGroupMenuTree[]>>('/api/user-menu-auth-state/auth-menu-list',{params: {authGrpSeq:authGrpSeq}});
    return data;
};

export const callGetUserMenuAuthUserComboList = async (searchText: string) => {
    const {data} = await axios.get<ApiResponse<UserMenuAuthUserComboList[]>>('/api/user-menu-auth-state/user-combo-list', {params:{
            searchText:searchText
        }});
    return data;
};