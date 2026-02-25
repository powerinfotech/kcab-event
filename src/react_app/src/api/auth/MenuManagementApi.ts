import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {BtnInfo, MenuBtnInfo, MenuInfo, MenuSavePayload} from '@interface/auth/MenuManagement';

export const callGetMenuInfo = async () => {
    const {data} = await axios.get<ApiResponse<MenuInfo[]>>('/api/menu-mgt/menu-list');
    return data;
};

export const callGetBtnList = async () => {
    const {data} = await axios.get<ApiResponse<BtnInfo[]>>('/api/menu-mgt/btn-list');
    return data;
};

export const callGetMenuBtnList = async (menuSeq: number) => {
    const {data} = await axios.get<ApiResponse<MenuBtnInfo[]>>('/api/menu-mgt/menu-btn-list', {
        params: { menuSeq },
    });
    return data;
};

export const callSaveMenu = async (payload: MenuSavePayload) => {
    const {data} = await axios.post<ApiResponse<void>>('/api/menu-mgt/save', payload);
    return data;
};

export const callDeleteMenu = async (menuSeq: number) => {
    const {data} = await axios.delete<ApiResponse<void>>(`/api/menu-mgt/delete/${menuSeq}`);
    return data;
};