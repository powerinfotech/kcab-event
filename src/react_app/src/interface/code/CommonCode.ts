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
    refval04: string;
    refval05: string;
    refval06: string;
    refval07: string;
    refval08: string;
    refval09: string;
    refval10: string;
    refval11: string;
    refval12: string;
    refval13: string;
    refval14: string;
    refval15: string;
    sortSeq: number;
    useYn: string;
    rgstUserSeq?: number;
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
