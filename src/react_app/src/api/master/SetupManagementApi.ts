import axios from "axios";
import {ApiResponse, CodeResponse} from "@interface/common";
import {AreaDataType, AreaListSearchParam, SectorDataType} from "@interface/master/SetupManagement";

export const callGetAreaList = async (searchParam: AreaListSearchParam) => {
    const {data} = await axios.get<ApiResponse<AreaDataType[]>>('/api/setup-mgt/area-list', {params: searchParam});
    return data;
};

export const callGetSectorList = async(areaSeq : number) => {
    const {data} = await axios.get<ApiResponse<SectorDataType[]>>('/api/setup-mgt/sector-list', {params : {areaSeq : areaSeq}});
    return data;
};

export const callSaveArea = async(param: AreaDataType | undefined) =>  {
    const {data} = await axios.post<ApiResponse<AreaDataType>>('/api/setup-mgt/save-area', param);
    return data;
};

export const callDeleteArea = async(areaSeq: number) =>  {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/setup-mgt/delete-area', {areaSeq : areaSeq});
    return data;
};

export const callGetAreaCmCodeList = async() => {
    const {data} = await axios.get<ApiResponse<CodeResponse[]>>('/api/setup-mgt/area-cd-list');
    return data;
};
