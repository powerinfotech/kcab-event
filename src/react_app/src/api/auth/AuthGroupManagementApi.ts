import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AuthGroupList} from '@interface/auth/AuthGroupManagement';


export const callGetAuthGroupList = async () => {
    const {data} = await axios.get<ApiResponse<AuthGroupList[]>>('/api/auth-group-mgt/auth-group-list');
    return data;
};

export const callSaveAuthGroup = async (authGroupList:AuthGroupList[]) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/auth-group-mgt/save',{authGroupList:authGroupList});
    return data;
};
