import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  PayTestEventOption,
  PayTestPrepareRequest,
  PayTestPrepareResponse,
  PayTestResult,
} from '@interface/admin/PayTest';

export const callGetPayTestEvents = async () => {
  const { data } = await axios.get<ApiResponse<PayTestEventOption[]>>('/api/admin/pay-test/events');
  return data;
};

export const callPreparePayTestPayment = async (request: PayTestPrepareRequest) => {
  const { data } = await axios.post<ApiResponse<PayTestPrepareResponse>>('/api/admin/pay-test/prepare', request);
  return data;
};

export const callGetPayTestResult = async (orderId: string) => {
  const { data } = await axios.get<ApiResponse<PayTestResult>>('/api/admin/pay-test/result', {
    params: { orderId },
    headers: { showLoading: false },
  });
  return data;
};
