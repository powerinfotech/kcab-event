import {IudType} from '@interface/common';

export interface ComCd {
    comCdSeq: number;
    comGrpCdSeq: number;
    comCd: string;
    comStdCd: string;
    comCdNm: string;
    comCdDesc: string;
    refval01: string;
    refval02: string;
    refval03: string;
    sortSeq: number;
    useYn: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ComCdList extends ComCd {
    iudType?: IudType;
    [key: string]: any;
}

export interface ComCdSaveData {
    comGrpCdSeq: number;
    comGrpCd: string;
    comCdList: ComCdList[];
}
