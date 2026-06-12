import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { MyEventsSession } from '@interface/public/MyEvents';

/** 이메일로 등록 행사가 있으면 인증코드 발송 (없으면 서버가 에러 메시지 반환) */
export const callRequestMyEventsCode = async (email: string) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/public/my-events/request-code', { email });
  return data;
};

/** 인증코드 검증 → 5분 세션 시작 + 내 정보/행사 반환 */
export const callVerifyMyEventsCode = async (email: string, code: string) => {
  const { data } = await axios.post<ApiResponse<MyEventsSession>>('/api/public/my-events/verify-code', {
    email,
    code,
  });
  return data;
};

/** 현재 유효한 세션 복원 (새로고침 시) — 만료면 에러 코드 반환 */
export const callGetMyEventsSession = async () => {
  const { data } = await axios.get<ApiResponse<MyEventsSession>>('/api/public/my-events/session', {
    headers: { showLoading: false },
  });
  return data;
};

/** 세션 5분 연장 */
export const callExtendMyEventsSession = async () => {
  const { data } = await axios.post<ApiResponse<MyEventsSession>>('/api/public/my-events/extend', {});
  return data;
};
