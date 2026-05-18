import {DefaultOptionType} from 'antd/es/select';

export interface ApiResponse<T> {
    item:T;
    message: string;
    code: number;
}

export interface ErrorResponse {
    message: string;
    code: number;
}

export enum ErrorCode {
    BUSINESS_ERROR = 400,
    AUTHORIZATION_ERROR = 401,
    INVALID_PARAMETER_ERROR = 452,
    INVALID_SESSION_ERROR = 453,
}

export enum IudType {
    I = 'I',
    U = 'U',
    D = 'D'
}

export interface CodeResponse {
    label:string;
    value:string;
}

export interface SessionUserInfo  {
    userId: string;
    userName: string;
    /** tb_user adm_yn (Y/N) */
    admYn: string;
    organizationName?: string;
}

export interface CommonCode {
   [ key: string]:string[];
}

export interface CommonCodeMap {
    [key:string]: {[key: string]: string};
}


export interface AutoCompleteOption extends DefaultOptionType {
}

export interface MenuBtnDetail {
    btnSeq: number;
    btnNm: string;
    btnFuncCd: string;
    sortSeq: number;
}

export type PageButtonHandlers = Record<string, (() => void) | undefined>;
