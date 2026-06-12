import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { SponsorListItem } from '@interface/admin/Sponsor';

/** 공개(비로그인) 스폰서 목록. year 미지정 시 서버가 최신 게시 연도를, tierCd 지정 시 해당 티어만 반환. */
export const callGetPublicSponsors = async (year?: number, tierCd?: string) => {
  const { data } = await axios.get<ApiResponse<SponsorListItem[]>>('/api/public/sponsors/list', {
    params: { year: year || undefined, tierCd: tierCd || undefined },
  });
  return data;
};
