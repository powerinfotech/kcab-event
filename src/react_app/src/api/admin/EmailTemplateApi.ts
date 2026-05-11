import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  EmailTemplateDetail,
  EmailTemplateListItem,
  EmailTemplateSaveParam,
} from '@interface/admin/EmailTemplate';

const BASE = '/api/admin/email-templates';

export const callGetEmailTemplates = async () => {
  const { data } = await axios.get<ApiResponse<EmailTemplateListItem[]>>(BASE);
  return data;
};

export const callGetEmailTemplateDetail = async (code: string) => {
  const { data } = await axios.get<ApiResponse<EmailTemplateDetail>>(`${BASE}/${code}`);
  return data;
};

export const callSaveEmailTemplate = async (code: string, param: EmailTemplateSaveParam) => {
  const { data } = await axios.put<ApiResponse<void>>(`${BASE}/${code}`, param);
  return data;
};
