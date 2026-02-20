import {AutoCompleteOption, IudType} from '@interface/common';


export interface AuthGroupRole  {
    authGrpRoleSeq: number;
    authGrpSeq: number;
    roleSeq: number;
    strDate?: string;
    endDate?: string;
    useFlag:boolean;
    rgstUserId?: string;
}


export interface AuthGroupRoleList extends AuthGroupRole {
    roleNm: string;
    iudType?:IudType;
}


export interface RoleAutoCompleteOption extends AutoCompleteOption {
    roleCd: string;
    roleNm: string;
    roleSeq: number;
    label:string
}