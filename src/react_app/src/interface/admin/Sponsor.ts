export interface SponsorTier {
  code: string;
  name: string;
  sortSeq?: number | null;
}

export interface SponsorListItem {
  sponsorSeq: number;
  editionYear: number;
  tierCd: string;
  tierCdNm?: string | null;
  tierSortSeq?: number | null;
  companyName: string;
  logoFileSeq?: number | null;
  logoFileDtlSeq?: number | null;
  logoFilePath?: string | null;
  logoFileUrl?: string | null;
  hasRemarks?: boolean | null;
  description?: string | null;
  representativeRemarks?: string | null;
  websiteUrl?: string | null;
  sortSeq: number;
  useYn: string;
  rgstUserName?: string | null;
  rgstDateTime?: string | null;
  uptUserName?: string | null;
  uptDateTime?: string | null;
}

export interface SponsorDetail extends SponsorListItem {
  rgstUserSeq?: number | null;
  uptUserSeq?: number | null;
}

export interface SponsorSavePayload {
  editionYear: number;
  tierCd: string;
  companyName: string;
  logoFileSeq?: number | null;
  description?: string | null;
  representativeRemarks?: string | null;
  websiteUrl?: string | null;
  sortSeq: number;
  useYn: string;
}

export interface SponsorSearchParams {
  editionYear?: number;
  tierCd?: string;
  useYn?: string;
  keyword?: string;
}
