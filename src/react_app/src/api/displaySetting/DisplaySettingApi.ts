import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { DisplaySetting } from '@interface/admin/DisplaySetting';

/** admin: 현재 설정 + 선택 가능한 연도 목록 */
export const callGetAdminDisplaySetting = async () => {
  const { data } = await axios.get<ApiResponse<DisplaySetting>>('/api/admin/display-setting');
  return data;
};

/** admin: 설정 저장 */
export const callSaveDisplaySetting = async (payload: {
  editionYear: number | null;
  showSponsors: string;
}) => {
  const { data } = await axios.put<ApiResponse<void>>('/api/admin/display-setting', payload);
  return data;
};

/** 공개: nav·페이지가 읽는 설정 (editionYear, showSponsors) */
export const callGetPublicDisplaySetting = async () => {
  const { data } = await axios.get<ApiResponse<DisplaySetting>>('/api/public/display-setting', {
    headers: { showLoading: false },
  });
  return data;
};
