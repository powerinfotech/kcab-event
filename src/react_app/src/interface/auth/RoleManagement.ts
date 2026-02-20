import {AutoCompleteOption, IudType} from '@interface/common';

export interface Role  {
    roleSeq: number;
    roleCd: string;
    roleNm: string;
    roleDesc: string;
    useFlag: boolean;
    rgstUserId?: string;
}

export interface RoleList extends Role {
    iudType?:IudType;
    rowNo?: number;
    [key: string]: any;
}


export interface RoleUser  {
    roleUserSeq: number;
    roleSeq: number;
    roleNm: string;
    userSeq: number;
    strDate?: string;
    endDate?: string;
    useFlag:boolean;
    rgstUserId?: string;
}


export interface RoleUserList extends RoleUser {
    userNm: string;
    iudType?:IudType;
    rowNo?: number;
}


export interface RoleUserAutoCompleteOption extends AutoCompleteOption {
    userId: string;
    userNm: string;
    userSeq: number;
    label:string
}