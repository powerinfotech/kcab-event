import {AutoCompleteOption} from '@interface/common';

export interface AccessUserListItem {
    userId:string;
    userName:string;
}

export interface AccessLogListParam {
    userId:string
    useFlag?:boolean
    searchText?:string
    startDate: string | null;
    endDate: string | null;
}
export interface AccessLogListItem {
    loginLogSeq:number;
    userId:string;
    userName:string;
    userLoginSeq:number;
    loginDateTime:string;
    accessIp:string;
    browser:string;
    accessNm:string;
}

export interface AccessLogAutoCompeteOption extends AutoCompleteOption {
    value2: string;
}