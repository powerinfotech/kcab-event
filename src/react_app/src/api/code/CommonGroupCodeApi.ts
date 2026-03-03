import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {ComGrpCdList, ComGrpCdSaveData} from '@interface/code/CommonGroupCode';

export const callGetComGrpCdList = async (searchText?: string) => {
    const {data} = await axios.get<ApiResponse<ComGrpCdList[]>>('/api/com-grp-cd/list', {params: {searchText}});
    return data;
};

export const callSaveComGrpCd = async (saveData: ComGrpCdSaveData) => {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/com-grp-cd/save', saveData);
    return data;
};
