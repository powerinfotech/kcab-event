import {IudType} from '@interface/common';


export interface CommonCodeListSearchParam {
    searchText?:string;
    comGrpCdSeq:number;
}

export interface CommonCodeListItem {
    comGrpCdSeq?:number;
    cmGrpCd:string;
    cmCd:string;
    comCdSeq?:number;
    cmNm:string;
    cmDesc:string;
    useFlag :boolean;
    refval01 :string;
    refval02 :string;
    refval03 :string;
    refval04 :string;
    refval05 :string;
    refval06 :string;
    refval07 :string;
    refval08 :string;
    refval09 :string;
    refval10 :string;
    refval11 :string;
    refval12 :string;
    refval13 :string;
    refval14 :string;
    refval15 :string;
    sortSeq:number;
    iudType:IudType
    unqKey:number;
}
