import React from 'react';
import {IudType} from '@interface/common';
import {MenuType} from '@interface/auth/MenuManagement';

export interface AuthGroupMenuTree {
  authGrpMenuSeq: React.ReactNode;
  authGrpSeq?: number;
  menuId: number;
  upMenuId: number;
  menuNm: string;
  menuTypeCd: MenuType;
  useFlag: boolean;
  iudType?:IudType;
  rgstUserId?: string;
  children?: AuthGroupMenuTree[];
}



export interface AuthGroupMenu {
  authGrpMenuSeq: number;
  authGrpCd: string;
  menuSeq: number;
  menuId: number;
  useFlag: boolean;
  rgstUserId?: string;
}


export interface AuthGroupMenuList extends AuthGroupMenu{
  upMenuId: number ;
  menuNm: string;
  menuTypeCd: MenuType;
  iudType?:IudType;
}
