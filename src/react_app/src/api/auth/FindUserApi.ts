import axios from "axios";
import {ApiResponse} from "@interface/common";
import {ChangePassword, findUserInfo, getId} from "@interface/auth/FindUser";

export const getUserId = async (params:findUserInfo)=>{
    const {data} = await axios.post<ApiResponse<getId>>('/api/find-user/find-id',params);
    return data;
};

export const getUserPassword = async (params:findUserInfo)=>{
    const {data} = await axios.post<ApiResponse<ChangePassword>>("/api/find-user/find-password",params);
    return data;
};

export const callChangePassword = async(param: ChangePassword | undefined) =>  {
    const {data} = await axios.post<ApiResponse<boolean>>('/api/find-user/change-password', param);
    return data;
};
