import axios from 'axios';
import { ApiResponse } from '@interface/common';
import type { AdminDashboardMetrics } from '@interface/admin/Dashboard';
import type { OrgDashboardMetrics } from '@interface/admin/OrgDashboard';

export const callGetAdminDashboardMetrics = async () => {
  const { data } = await axios.get<ApiResponse<AdminDashboardMetrics>>('/api/admin/dashboard/metrics');
  return data;
};

export const callGetOrgDashboardMetrics = async () => {
  const { data } = await axios.get<ApiResponse<OrgDashboardMetrics>>('/api/admin/dashboard/org-metrics');
  return data;
};
