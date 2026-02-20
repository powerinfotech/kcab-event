import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {MenuInfo} from '@interface/auth/MenuManagement';


export const callGetMenuInfo = async () => {
    const {data} = await axios.get<ApiResponse<MenuInfo[]>>('/api/menu-mgt/menu-list');
    return data;
};


export const callSaveMenu = async (menu:MenuInfo) => {
    const {data} = await axios.post<ApiResponse<MenuInfo[]>>('/api/menu-mgt/save', menu);
    return data;
};


export const callDeleteMenu = async (menuSeq:number) => {
    const {data} = await axios.delete<ApiResponse<MenuInfo[]>>(`/api/menu-mgt/delete/${menuSeq}`);
    return data;
};