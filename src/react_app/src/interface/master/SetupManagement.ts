import {IudType} from "@interface/common";

export interface AreaListSearchParam {
    areaName?:string;
    areaCdName?:string;
    includeUnusedFlag?:boolean;
}

export interface AreaDataType {
    areaSeq: number;
    areaName: string;
    areaCd: string;
    areaCdNm: string;
    areaZipNo?: string;
    areaAddr?: string;
    areaDtlAddr?: string;
    areaLatitude?: string;
    areaLongitude?: string;
    areaDesc?: string;
    lastUpdateDate?: string;
    lastModifyUserName?: string;
    useFlag?: boolean;
    iudType?:IudType;
    [key: string]: any;
}

export interface SectorDataType {
    sectorSeq: number;
    areaSeq: number;
    sectorName: string;
    sectorCd: string;
    sectorCdNm: string;
    sectorDesc?: string;
    srtSq: number;
    useFlag?: boolean;
    xAxis?: string;
    yAxis?: string;
    iudType?:IudType;
}