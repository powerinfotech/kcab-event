import {IudType} from "@interface/common";

export interface Inst{
    instSeq : number;
    instName :string;
    instCd:string;
    instCode:string;
    instZipNo:string;
    instAddr:string;
    instDtlAddr:string;
    instTelNo:string;
    instEmail:string;
    instDesc:string;
    rgstUserId:string;
    rgstDateTime:string;
    uptUserId:string;
    uptDateTime:string;
    useFlag:boolean;
}

export interface InstList extends Inst{
    iudType?:IudType;

}

export interface InstLisSearchParam {
    instName : string,
    isCheck? : boolean
}