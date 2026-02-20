import {IudType} from '@interface/common';

export interface NationAddrNoStateSearchParam {
    searchText:string,
    sggCd:string,
    instlCd:string
}

export interface NationAddrNoSearchInfo {
    sggList: {label:string,value:string , parent?:string}[]
    instlList: {label:string,value:string}[]
    instlInstList?: {label:string,value:string}[]
}

export interface NationAddrNoStateListItem  {
    iudType?:IudType;
    unqKey?:number;
    ntnlPntSeq:number;
    accdntAreaFlag:boolean;
    ntnlPntNo:string;
    lctnSignNo:string;
    snsrSrlNo:string;
    sggCd:string;
    sggNm:string;
    instlTypeCd:string;
    xcrdnt:number;
    ycrdnt:number;
    zcrdnt:number;
    lng:number;
    lat:number;
    hght:number;
    snsrLng:number;
    snsrLat:number;
    srtSq:number;
    useFlag:boolean;
    rgstDateTime?:string;
    uptDateTime?:string;
    instlCd:string;
    instlName:string;
    instlTypeName:string;
}
