import axios from 'axios';
import {ApiResponse} from '@interface/common';
import {AccessLogListItem, AccessLogListParam, AccessUserListItem} from '@interface/stats/AccessLog';


export const callGetAccessLogUserList = async (searchText: string) => {
    const {data} = await axios.get<ApiResponse<AccessUserListItem[]>>('/api/access-log/user-list', {params:{
            searchText:searchText
        }});
    return data;
};

export const callGetAccessLogList = async (param: AccessLogListParam) => {
    const {data} = await axios.get<ApiResponse<AccessLogListItem[]>>('/api/access-log/log-list', {params:param});
    return data;
};