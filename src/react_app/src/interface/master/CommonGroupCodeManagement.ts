import {IudType} from '@interface/common';

export interface CommonGepCodeSearchParam {
    searchText:string
}

export interface CommonGrpCodeListItem {
    comGrpCdSeq?:number;
    cmGrpCd :string;
    cmGrpNm :string;
    cmGrpExpl :string;
    useFlag :boolean;
    ref01 :string;
    ref02 :string;
    ref03 :string;
    ref04 :string;
    ref05 :string;
    ref06 :string;
    ref07 :string;
    ref08 :string;
    ref09 :string;
    ref10 :string;
    ref11 :string;
    ref12 :string;
    ref13 :string;
    ref14 :string;
    ref15 :string;
    iudType:IudType
    unqKey:number;
}