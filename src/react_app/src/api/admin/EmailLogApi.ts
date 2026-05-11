import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { EmailLogDetail, EmailLogListItem, EmailLogSearchParam } from '@interface/admin/EmailLog';

const BASE = '/api/admin/email-logs';

export const callGetEmailLogs = async (param: EmailLogSearchParam) => {
  const { data } = await axios.get<ApiResponse<EmailLogListItem[]>>(BASE, { params: param });
  return data;
};

export const callGetEmailLogDetail = async (emailLogSeq: number) => {
  const { data } = await axios.get<ApiResponse<EmailLogDetail>>(`${BASE}/${emailLogSeq}`);
  return data;
};
