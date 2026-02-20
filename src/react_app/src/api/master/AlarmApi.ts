import axios from "axios";
import {ApiResponse} from "@interface/common";
import {
    alarmItem, alarmSearchCondition
} from "@interface/master/Alarm";

export const getSensorAlarmList = async (param: boolean) => {
    const {data} = await axios.get<ApiResponse<alarmItem[]>>('/api/common/alarm-list', {params:{allFlag:param}});
    return data;
};
export const callUpdateAlarm = async (param: alarmItem) => {
    const {data} = await axios.post<ApiResponse<alarmItem>>('/api/common/update-alarm', param);
    return data;
};

export const callUpdateAlarmAll = async () => {
    const {data} = await axios.post<ApiResponse<alarmItem>>('/api/common/update-alarm-all');
    return data;
};

