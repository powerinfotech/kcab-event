import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {SensorListItem, SensorPackListItem, SensorPackSearchInfo, SensorPackSearchParam} from '@interface/code/Sensor';
import {NationAddrNoSearchInfo, NationAddrNoStateSearchParam} from "@interface/code/NationAddrNoState";

export const callGetSensorStateNationAddrNoStateSearch = async () => {
    const {data} = await axios.get<ApiResponse<SensorPackSearchInfo>>('/api/sensor-state/search-conditions');
    return data;
};

export const callGetSensorStateNationAddrNoStateList = async (param:SensorPackSearchParam) => {
    const {data} = await axios.get<ApiResponse<SensorPackListItem[]>>('/api/sensor-state/list',{
        params:param
    });
    return data;
};

export const callGetSensorDetailList = async (ntnlPntNo:string) => {
    const {data} = await axios.get<ApiResponse<SensorListItem[]>>('/api/sensor-state/detail-list',{
        params:{ntnlPntNo:ntnlPntNo}
    });
    return data;
};