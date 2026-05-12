export interface SettingsGroup {
  comGrpCdSeq: number;
  comGrpCd: string;
  comGrpCdNm: string;
  comGrpCdDesc: string;
  ref01: string;
  ref02: string;
  ref03: string;
  sortSeq: number;
  iudType?: 'I' | 'U' | 'D';
}

export interface SettingsCode {
  comCdSeq: number;
  comGrpCdSeq: number;
  comGrpCd: string;
  comCd: string;
  comCdNm: string;
  comCdDesc: string;
  refval01: string;
  refval02: string;
  refval03: string;
  sortSeq: number;
  organizationCount?: number;
  currentEventCount?: number;
  iudType?: 'I' | 'U' | 'D';
}

export interface OrganizationGradeLimit {
  grade: string;
  gradeName: string;
  maxEventCount: number;
  sortSeq: number;
  organizationCount: number;
  currentEventCount: number;
}

export interface OrganizationGradeLimitSaveItem {
  grade: string;
  gradeName: string;
  maxEventCount: number;
  sortSeq: number;
}
