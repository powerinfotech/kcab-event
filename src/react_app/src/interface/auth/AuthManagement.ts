import {IudType} from '@interface/common';

// tb_auth_grp 컬럼: auth_grp_seq, auth_grp_nm, auth_grp_expl, use_yn, rgst_user_seq, rgst_date_time, upt_user_seq, upt_date_time
export interface AuthGrp {
    authGrpSeq: number;
    authGrpNm: string;
    authGrpExpl: string;
    useYn: string;
    rgstUserSeq?: number;
}

export interface AuthGrpList extends AuthGrp {
    iudType?: IudType;
    [key: string]: any;
}

// tb_auth 컬럼: auth_seq, auth_grp_seq, auth_nm, auth_expl, use_yn, rgst_user_seq, rgst_date_time, upt_user_seq, upt_date_time
export interface AuthInfo {
    authSeq: number;
    authGrpSeq: number;
    authNm: string;
    authExpl: string;
    useYn: string;
    rgstUserSeq?: number;
}

export interface AuthInfoList extends AuthInfo {
    iudType?: IudType;
    [key: string]: any;
}

// tb_auth_user 컬럼: auth_user_seq, auth_grp_seq, auth_seq, user_seq, str_dt, end_dt, use_yn, rgst_user_seq, rgst_date_time, upt_user_seq, upt_date_time
// + tb_user join: user_id, user_name
export interface AuthUserInfo {
    authUserSeq: number;
    authGrpSeq: number;
    authSeq: number;
    userSeq: number;
    userId: string;
    userName: string;
    strDt: string;
    endDt: string;
    useYn: string;
    rgstUserSeq?: number;
}

export interface AuthUserInfoList extends AuthUserInfo {
    iudType?: IudType;
    [key: string]: any;
}

export interface UserSearchResult {
    userSeq: number;
    userId: string;
    userName: string;
}

export interface AuthManagementSaveData {
    authGrpList: AuthGrpList[];
    authList: AuthInfoList[];
    authUserList: AuthUserInfoList[];
}
