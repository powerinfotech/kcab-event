import axios from 'axios';
import {User} from '@interface/master/UserManagement';
import {ApiResponse, CommonCodeMap, IudType, MenuBtnDetail} from '@interface/common';
import {MenuInfo} from '@interface/auth/MenuManagement';
import {Role} from '@interface/auth/RoleManagement';
import {FileDetailType} from "@component/upload/CustomFile";
import {RcFile} from "antd/es/upload/interface";


export const getViewCmCode = async (props:any) => {
    const viewCmCode: CommonCodeMap = {};
    for(const cmGroupCode of props.cmGroupCodeList) {
        const {data} = await axios.get<CommonCodeMap>(`/api/common-code/${cmGroupCode}`);
        viewCmCode[cmGroupCode] = data.item;

    }
    return  viewCmCode;
};


export const getUserLoginInfo = async () => {
    const {data} = await axios.get<ApiResponse<User>>('/api/common/login-info');
    return data;
};


export const getUserListByUserName = async (searchText: string) => {
    const {data} = await axios.get<ApiResponse<User[]>>('/api/common/user-list',  {params:{userName:searchText},headers:{showLoading:false}});
    return data;
};

export const getRoleListByRoleName = async (searchText: string) => {
    const {data} = await axios.get<ApiResponse<Role[]>>('/api/common/role-list',  {params:{roleName:searchText, useFlag: true},headers:{showLoading:false}});
    return data;
};


export const getUserMenuInfo = async () => {
    const {data} = await axios.get<ApiResponse<MenuInfo[]>>('/api/common/menu-info');
    return data;
};



export const callGetMenuBtnList = async (menuSeq: number) => {
    const {data} = await axios.get<ApiResponse<MenuBtnDetail[]>>('/api/common/menu-btn-list', {params: {menuSeq}, headers: {showLoading: false}});
    return data;
};

export const callLogout = async () => {
   const {data} = await axios.post<ApiResponse<boolean>>('/api/logout');
   return data;
};

export const callGetFileList = async (fileSeq : number|null) => {
    const {data} = await axios.get<ApiResponse<FileDetailType[]>>('/api/file-list', {params:{fileSeq : fileSeq}});
    return data;
};

export const callSaveFiles = async (fileSeq : number|null, menuSeq : number, fileList : FileDetailType[]) => {
    const insertFileList = fileList.filter((fileData) => fileData.iudType === IudType.I);
    const updateFileList = fileList.filter((fileData) => fileData.iudType === IudType.U);
    const deleteFileList = fileList.filter((fileData) => fileData.iudType === IudType.D);

    const formData = new FormData();

    const insertFileMetaList = insertFileList.map((fileData) => {
        formData.append('insertFiles', fileData.originFileObj as RcFile);
        return {
            fileSeq : fileSeq,
            menuSeq : menuSeq,
            fileNm : fileData.fileNm,
            srtSq : fileData.srtSq,
        };
    });

    const updateFileMetaList = updateFileList.map((fileData) => {
        return {
            fileDtlSeq : fileData.fileDtlSeq,
            fileSeq : fileSeq,
            srtSq : fileData.srtSq
        };
    });

    const deleteFileMetaList = deleteFileList.map((fileData) => {
       return {
           fileDtlSeq : fileData.fileDtlSeq,
           fileSeq : fileSeq,
           fileNm : fileData.fileNm,
           filePath : fileData.filePath
       };
    });

    if (fileSeq) {
        formData.append("fileSeq", fileSeq.toString());
    }

    formData.append("insertFileMetaList", JSON.stringify(insertFileMetaList));
    formData.append("updateFileList", JSON.stringify(updateFileMetaList));
    formData.append("deleteFileList", JSON.stringify(deleteFileMetaList));

    const {data} = await axios.post<ApiResponse<any>>('/api/save-file', formData);

    return data;
};


