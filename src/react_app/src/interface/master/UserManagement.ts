import {IudType} from '@interface/common';

export interface UserListSearchParam  {
    userId: string;
    userName: string;
    isCheck?:boolean;
}

export interface User  {
    userSeq: number;
    userId: string;
    passwd: string;
    userName: string;
    userNameEng: string;
    nickName: string;
    userCd: string;
    telNo: string;
    hpNo: string;
    deptCd: string;
    email: string;
    workCd: string;
    strDate: string | undefined;
    endDate: string | undefined;
    loginDateTime: string | undefined;
    useFlag: boolean;
    admFlag: boolean;
    [key: string]: any; // User 인터페이스가 모든 키 값을 가질 수 있도록 수정
}

export interface UserList extends User {
    lastUpdateDate: string | undefined;
    lastModifyUserName: string;
    iudType?:IudType;
}

export interface ChangePassword {
    userSeq: number;
    userId: string;
    passwd?: string;
    password_retry?: string;
}


