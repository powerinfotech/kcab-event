import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  PaymentCancelRequest,
  PaymentDetail,
  PaymentEventOption,
  PaymentListItem,
  PaymentListSearchParam,
} from '@interface/admin/PaymentManagement';

function csv<T>(values?: T[]): string | undefined {
  return values && values.length ? values.join(',') : undefined;
}

export const callGetPaymentList = async (param: PaymentListSearchParam = {}) => {
  const { data } = await axios.get<ApiResponse<PaymentListItem[]>>('/api/admin/payments', {
    params: {
      keyword: param.keyword,
      eventSeqs: csv(param.eventSeqs),
      statuses: csv(param.statuses),
      pgProviders: csv(param.pgProviders),
      paymentMethods: csv(param.paymentMethods),
      currencies: csv(param.currencies),
      fromDate: param.fromDate,
      toDate: param.toDate,
      minAmount: param.minAmount,
      maxAmount: param.maxAmount,
    },
  });
  return data;
};

export const callGetPaymentEventOptions = async () => {
  const { data } = await axios.get<ApiResponse<PaymentEventOption[]>>('/api/admin/payments/events');
  return data;
};

export const callGetPaymentDetail = async (paymentSeq: number) => {
  const { data } = await axios.get<ApiResponse<PaymentDetail>>(`/api/admin/payments/${paymentSeq}`);
  return data;
};

export const callCancelPayment = async (paymentSeq: number, request: PaymentCancelRequest) => {
  const { data } = await axios.post<ApiResponse<PaymentDetail>>(`/api/admin/payments/${paymentSeq}/cancel`, request);
  return data;
};

export const callUpdatePaymentMemo = async (paymentSeq: number, adminMemo: string) => {
  const { data } = await axios.put<ApiResponse<void>>(`/api/admin/payments/${paymentSeq}/memo`, { adminMemo });
  return data;
};
