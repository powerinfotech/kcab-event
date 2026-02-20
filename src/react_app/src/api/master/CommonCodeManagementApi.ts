import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {CommonCodeListItem, CommonCodeListSearchParam} from '@interface/master/CommonCodeManagement';
import {CommonGepCodeSearchParam, CommonGrpCodeListItem} from '@interface/master/CommonGroupCodeManagement';
import {NationAddrNoStateSearchParam} from "@interface/code/NationAddrNoState";


export const callGetCommonGrpCodeList = async (param:CommonGepCodeSearchParam) => {
    const {data} = await axios.get<ApiResponse<CommonGrpCodeListItem[]>>('/api/common-code/grp-list', {params:param});
    return data;
};

export const callSaveCommonGrpCodeList = async (param:CommonGrpCodeListItem[]) => {
    const {data} = await axios.post<ApiResponse<CommonGrpCodeListItem[]>>('/api/common-code/grp-save', param);
    return data;
};

export const callGetCommonCodeList = async (param:CommonCodeListSearchParam) => {
    const {data} = await axios.get<ApiResponse<CommonCodeListItem[]>>('/api/common-code/list', {params:param});
    return data;
};

export const callSetCommonCodeList = async (param:CommonCodeListItem[]) => {
    const {data} = await axios.post<ApiResponse<CommonCodeListItem[]>>('/api/common-code/save', param);
    return data;
};