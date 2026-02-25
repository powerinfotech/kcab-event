import {IudType} from '@interface/common';
import {TreeDataNode} from 'antd';


export interface MenuListSearchParam  {
    menuNm: string;
    isExceptUnused?:boolean;
}


export enum MenuType {
    D='D',
    V='V'
}
export interface Menu  {
    menuSeq: number;
    upMenuSeq: number;
    menuNm: string;
    menuTypeCd: MenuType;
    menuViewPath: string;
    menuUrl: string;
    useYn: string;
    sortSeq: number;
}

export interface MenuInfo extends Menu {
    menuNamePath: string;
    menuIdPath: string;
    level: number;
    iudType?:IudType;
    rgstUserName: string;
    rgstDateTime: string;
    uptUserName?: string;
    uptDateTime?: string;
}


export interface EmptyMenu {
    menuSeq:  number | undefined;
    upMenuSeq: number | undefined;
    menuNm: string;
    menuTypeCd: MenuType | undefined;
    menuViewPath: string | undefined;
    menuUrl: string | undefined;
    useYn: string | undefined;
    sortSeq: number | undefined;
}

export interface MenuTree extends TreeDataNode {
    useYn?: string;
}

export interface FolderTree  {
    value: string;
    label: string;
    children?: FolderTree[];
}

export interface BtnInfo {
    btnSeq: number;
    sortSeq: number;
    btnNm: string;
    useYn: string;
}

export interface MenuBtnInfo {
    menuBtnSeq?: number;
    menuSeq?: number;
    btnSeq: number;
    btnNm: string;
    useYn: string;
}

export interface MenuSavePayload extends MenuInfo {
    menuBtnList?: MenuBtnSaveItem[];
}

export interface MenuBtnSaveItem {
    btnSeq: number;
    btnNm: string;
    useYn: string;
}
