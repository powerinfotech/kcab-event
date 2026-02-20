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
    menuId: number ;
    upMenuId: number;
    menuNm: string;
    menuTypeCd: MenuType;
    menuViewPath: string;
    menuUri: string;
    useFlag: boolean;
    sortSeq: number;
}

export interface MenuInfo extends Menu {
    menuNamePath: string;
    menuIdPath: string;
    level: number;
    iudType?:IudType;

    rgstUserNm: string;
    rgstDate: string;
    uptUserName?: string;
    uptDate?: string;
}


export interface EmptyMenu {
    menuSeq:  number | undefined;
    menuId: number | undefined ;
    upMenuId: number | undefined;
    menuNm: string;
    menuTypeCd: MenuType | undefined;
    menuViewPath: string | undefined;
    menuUri: string | undefined;
    useFlag: boolean | undefined;
    sortSeq: number | undefined;
}

export interface MenuTree extends TreeDataNode {
    useFlag?:boolean;
}

export interface FolderTree  {
    value: string;
    label: string;
    children?: FolderTree[];
}
