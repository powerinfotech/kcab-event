
export interface SensorPackSearchParam {
    searchText:string,
    sggCd:string
};

export interface SensorPackSearchInfo {
    sggList: {label:string,value:string}[]
    ,instlList: {label:string,value:string}[]
}

export interface SensorPackListItem {
    unqKey?:number;
    accdntAreaFlag:boolean;
    ntnlPntNo:string;
    lctnSignNo:string;
    snsrSrlNo:string;
    sggCd:string;
    sggNm:string;
    slrPnlFlag:boolean;
}

export interface SensorListItem {
    columns1:string,
    columns2:string,
    columns3:string,
    columns4:string,
    columns5:string,
    eventType:string
    unqKey:number,
    rowSpan1?:number,
    rowSpan2?:number;
    colsSpan1?:number,
    colsSpan2?:number
}