import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {ComCdList, ComCdSaveData} from '@interface/code/CommonCode';

export const callGetComCdList = async (comGrpCdSeq: number) => {
    const {data} = await axios.get<ApiResponse<ComCdList[]>>('/api/com-cd/list', {params: {comGrpCdSeq}});
    return data;
};

export const callSaveComCd = async (saveData: ComCdSaveData) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/com-cd/save', saveData);
    return data;
};
