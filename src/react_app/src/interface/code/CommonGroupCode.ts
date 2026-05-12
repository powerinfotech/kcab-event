import {IudType} from '@interface/common';

export interface ComGrpCd {
    comGrpCdSeq: number;
    comGrpCd: string;
    comGrpCdNm: string;
    comGrpCdDesc: string;
    ref01: string;
    ref02: string;
    ref03: string;
    sortSeq: number;
    useYn: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ComGrpCdList extends ComGrpCd {
    iudType?: IudType;
    [key: string]: any;
}

export interface ComGrpCdSaveData {
    comGrpCdList: ComGrpCdList[];
}
