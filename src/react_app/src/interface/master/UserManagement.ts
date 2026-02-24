import {IudType} from '@interface/common';

export interface UserListSearchParam  {
    userId?: string;
    userName?: string;
    idOrName?: string;
    isCheck?: boolean;
}

export interface User {
    userSeq: number;
    userId: string;
    password: string;
    userName: string;
    userNameEng: string;
    nickName: string;
    userCd: string;
    telNo: string;
    hpNo: string;
    dprtCd: string;
    email: string;
    strDate: string | undefined;
    endDate: string | undefined;
    loginDateTime: string | undefined;
    useYn: string;
    admYn: string;
    rgstUserSeq?: number;
    rgstDateTime?: string;
    uptUserSeq?: number;
    uptDateTime?: string;
    [key: string]: any;
}

export interface UserList extends User {
    lastUpdateDate: string | undefined;
    lastModifyUserName: string;
    iudType?: IudType;
}

export interface ChangePassword {
    userSeq: number;
    userId: string;
    password?: string;
    password_retry?: string;
}


