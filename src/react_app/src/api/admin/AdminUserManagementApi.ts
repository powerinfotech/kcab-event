import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSaveParam,
  AdminUserSearchParam,
} from '@interface/admin/AdminUserManagement';

const BASE = '/api/admin/users';

export const callGetAdminUsers = async (param: AdminUserSearchParam) => {
  const { data } = await axios.get<ApiResponse<AdminUserListItem[]>>(BASE, { params: param });
  return data;
};

export const callGetAdminUserDetail = async (userSeq: number) => {
  const { data } = await axios.get<ApiResponse<AdminUserDetail>>(`${BASE}/${userSeq}`);
  return data;
};

export const callCreateAdminUser = async (param: AdminUserSaveParam) => {
  const { data } = await axios.post<ApiResponse<void>>(BASE, param);
  return data;
};

export const callUpdateAdminUser = async (userSeq: number, param: AdminUserSaveParam) => {
  const { data } = await axios.put<ApiResponse<void>>(`${BASE}/${userSeq}`, param);
  return data;
};

export const callApproveAdminUser = async (userSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>(`${BASE}/${userSeq}/approve`);
  return data;
};

export const callSuspendAdminUser = async (userSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>(`${BASE}/${userSeq}/suspend`);
  return data;
};

export const callReactivateAdminUser = async (userSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>(`${BASE}/${userSeq}/reactivate`);
  return data;
};

export const callWithdrawAdminUser = async (userSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>(`${BASE}/${userSeq}/withdraw`);
  return data;
};
