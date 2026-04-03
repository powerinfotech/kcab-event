import {IudType} from '@interface/common';

export interface ComGrpCd {
    comGrpCdSeq: number;
    comGrpCd: string;
    comGrpCdNm: string;
    comGrpCdDesc: string;
    ref01: string;
    ref02: string;
    ref03: string;
    ref04: string;
    ref05: string;
    ref06: string;
    ref07: string;
    ref08: string;
    ref09: string;
    ref10: string;
    ref11: string;
    ref12: string;
    ref13: string;
    ref14: string;
    ref15: string;
    sortSeq: number;
    useYn: string;
    rgstUserSeq?: number;
}

export interface ComGrpCdList extends ComGrpCd {
    iudType?: IudType;
    [key: string]: any;
}

export interface ComGrpCdSaveData {
    comGrpCdList: ComGrpCdList[];
}
