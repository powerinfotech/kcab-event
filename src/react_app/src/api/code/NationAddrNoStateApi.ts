import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {
    NationAddrNoSearchInfo,
    NationAddrNoStateListItem,
    NationAddrNoStateSearchParam
} from '@interface/code/NationAddrNoState';

export const callGetNationAddrNoStateSearch = async () => {
    const {data} = await axios.get<ApiResponse<NationAddrNoSearchInfo>>('/api/nation-addr/search-conditions');
    return data;
};

export const callGetNationAddrNoStateList = async (param:NationAddrNoStateSearchParam) => {
    const {data} = await axios.get<ApiResponse<NationAddrNoStateListItem[]>>('/api/nation-addr/list',{
        params:param
    });
    return data;
};

export const callSetNationAddrNoStateList = async (param:NationAddrNoStateListItem[]) => {
    const {data} = await axios.post<ApiResponse<NationAddrNoStateListItem[]>>('/api/nation-addr/save',param);
    return data;
};