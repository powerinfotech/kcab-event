import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  OrganizationGradeLimit,
  OrganizationGradeLimitSaveItem,
  SettingsCode,
  SettingsGroup,
} from '@interface/admin/Settings';

export const callGetSettingsGroups = async () => {
  const { data } = await axios.get<ApiResponse<SettingsGroup[]>>('/api/admin/settings/groups');
  return data;
};

export const callSaveSettingsGroups = async (groups: SettingsGroup[]) => {
  const { data } = await axios.put<ApiResponse<void>>('/api/admin/settings/groups', groups);
  return data;
};

export const callGetSettingsCodes = async (comGrpCd: string) => {
  const { data } = await axios.get<ApiResponse<SettingsCode[]>>('/api/admin/settings/codes', {
    params: { comGrpCd },
  });
  return data;
};

export const callSaveSettingsCodes = async (comGrpCd: string, codes: SettingsCode[]) => {
  const { data } = await axios.put<ApiResponse<void>>('/api/admin/settings/codes', codes, {
    params: { comGrpCd },
  });
  return data;
};

export const callGetOrganizationGradeLimits = async () => {
  const { data } = await axios.get<ApiResponse<OrganizationGradeLimit[]>>(
    '/api/admin/settings/organization-grade-limits',
  );
  return data;
};

export const callSaveOrganizationGradeLimits = async (limits: OrganizationGradeLimitSaveItem[]) => {
  const { data } = await axios.put<ApiResponse<void>>(
    '/api/admin/settings/organization-grade-limits',
    limits,
  );
  return data;
};
