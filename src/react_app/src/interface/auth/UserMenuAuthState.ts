import {AutoCompleteOption} from '@interface/common';
import {MenuType} from '@interface/auth/MenuManagement';
import React from 'react';

export interface UserMenuAuthUserComboList {
    userId:string;
    userName:string;
    userSeq:number;
}

export interface UserComboAutoCompeteOption extends AutoCompleteOption {
    userSeq: number;
}


export interface UserMenuAuthGroupList {
    authGrpSeq: number;
    authGrpCd: string;
    authGrpNm: string;
    useFlag: boolean;
}

export interface UserMenuAuthMenuList {
    authGrpSeq: number;
    menuSeq: number;
    upMenuSeq: number;
    menuNm: string;
    menuTypeCd: MenuType;
    useFlag: boolean;
}


export interface UserMenuAuthMenuTree {
    menuSeq: React.ReactNode;
    authGrpSeq: number;
    upMenuSeq: number;
    menuNm: string;
    menuTypeCd: MenuType;
    useFlag: boolean;
    children?: UserMenuAuthMenuTree[];
}