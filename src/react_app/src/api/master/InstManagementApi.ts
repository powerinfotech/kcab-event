import axios from "axios";
import {ApiResponse} from "@interface/common";
import {User} from "@interface/master/UserManagement";
import {Inst, InstLisSearchParam} from "@interface/master/InstitutionManagement";



export const callGetInstManagementStateSearch = async ()=>{
    const {data} = await axios.get('api/inst-mgt/search-conditions');
    return data;
};

export const callGetInstList = async (param: InstLisSearchParam)=>{
    const {data} = await axios.get<ApiResponse<Inst[]>>('api/inst-mgt/inst-list',{params:param});
    return data;
};

export const callSaveInst = async (param:Inst|undefined)=>{
    const {data} = await axios.post<ApiResponse<number>>('api/inst-mgt/save-inst',param);
    return data;
};

export const callDeleteUser=async(instSeq:number)=>{
    const {data}=await axios.post<ApiResponse<boolean>>('api/inst-mgt/delete-inst',{instSeq:instSeq});
    return data;
};
