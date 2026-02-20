import {IudType} from "@interface/common";

export interface Notice{
    noticeSeq:number;
    viewCnt:number;
    fileSeq?:number;

    popupFlag:boolean;
    fixFlag:boolean;
    useFlag:boolean;
    isChange?:boolean;

    strDate:string | undefined;
    endDate:string | undefined;

    ctgrCd:string;
    title:string;
    content:string;
    rgstUserId:string;
    rgstDateTime:string;
    uptUserId:string;
    uptDateTime:string;
    rgstUserNm:string;
    ctgrNm:string;
    fixFlagLabel?:string;
    popupFlagLabel?:string;
}
export interface NoticeList extends Notice{
    iudType?:IudType;
}

export interface NoticeListSearchParam {
    title:string;
    isChecked?:boolean;
}

