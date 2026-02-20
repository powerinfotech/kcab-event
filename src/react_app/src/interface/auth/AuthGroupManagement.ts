import {IudType} from '@interface/common';

export interface AuthGroup  {
    authGrpSeq: number;
    authGrpCd: string;
    authGrpNm: string;
    authGrpDesc: string;
    authGrpTypeCd: string;
    useFlag: boolean;
    rgstUserId?: string;
}

export interface AuthGroupList extends AuthGroup {
    iudType?:IudType;
    rowNo?: number;
    [key: string]: any;
}