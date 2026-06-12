import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  SponsorDetail,
  SponsorListItem,
  SponsorSavePayload,
  SponsorSearchParams,
  SponsorTier,
} from '@interface/admin/Sponsor';

const BASE_URL = '/api/admin/sponsor';

export const callGetSponsorList = async (params: SponsorSearchParams = {}) => {
  const { data } = await axios.get<ApiResponse<SponsorListItem[]>>(BASE_URL, {
    params: {
      editionYear: params.editionYear || undefined,
      tierCd: params.tierCd || undefined,
      useYn: params.useYn || undefined,
      keyword: params.keyword || undefined,
    },
  });
  return data;
};

export const callGetSponsorTiers = async () => {
  const { data } = await axios.get<ApiResponse<SponsorTier[]>>(`${BASE_URL}/tiers`);
  return data;
};

export const callGetSponsorDetail = async (sponsorSeq: number) => {
  const { data } = await axios.get<ApiResponse<SponsorDetail>>(`${BASE_URL}/${sponsorSeq}`);
  return data;
};

export const callCreateSponsor = async (payload: SponsorSavePayload) => {
  const { data } = await axios.post<ApiResponse<number>>(BASE_URL, payload);
  return data;
};

export const callUpdateSponsor = async (sponsorSeq: number, payload: SponsorSavePayload) => {
  const { data } = await axios.put<ApiResponse<number>>(`${BASE_URL}/${sponsorSeq}`, payload);
  return data;
};

export const callDeleteSponsor = async (sponsorSeq: number) => {
  const { data } = await axios.delete<ApiResponse<void>>(`${BASE_URL}/${sponsorSeq}`);
  return data;
};
