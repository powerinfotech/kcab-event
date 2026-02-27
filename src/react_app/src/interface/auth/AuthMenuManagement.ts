import {IudType} from '@interface/common';

// 좌측 grid: 권한 목록
export interface AuthMenuMgtAuth {
    authSeq: number;
    authGrpSeq: number;
    authGrpNm: string;
    authNm: string;
    authExpl: string;
    useYn: string;
    rowNo?: number;
    [key: string]: any;
}

// 백엔드 flat 응답 (menu + btn + permissions)
export interface AuthMenuBtnItem {
    menuSeq: number;
    upMenuSeq: number | null;
    menuNm: string;
    menuTypeCd: string;
    menuUseYn: string;
    sortSeq: number;
    level: number;
    sortSeqPath: string;
    btnSeq: number;
    btnSortSeq: number;
    btnNm: string;
    menuBtnUseYn: string | null;
    authMenuBtnSeq: number | null;
    authMenuBtnUseYn: string | null;
}

// 우측 tree table row
export interface AuthMenuBtnRow {
    menuSeq: number;
    upMenuSeq: number | null;
    menuNm: string;
    menuTypeCd: string;
    children?: AuthMenuBtnRow[];
    [key: string]: any;
}

// 버튼 칼럼 정보
export interface BtnColumnInfo {
    btnSeq: number;
    btnSortSeq: number;
    btnNm: string;
}

// 저장 항목
export interface AuthMenuBtnSaveItem {
    authMenuBtnSeq: number | null;
    authGrpSeq: number;
    authSeq: number;
    menuSeq: number;
    btnSeq: number;
    useYn: string;
    iudType: IudType;
}

// 저장 파라미터
export interface AuthMenuBtnSaveParam {
    authGrpSeq: number;
    authSeq: number;
    saveList: AuthMenuBtnSaveItem[];
}
