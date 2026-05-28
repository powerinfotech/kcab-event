import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  PublicRegistrationDiscountValidationRequest,
  PublicRegistrationDiscountValidationResult,
  PublicRegistrationParticipantRequest,
  PublicRegistrationPaymentResult,
  PublicRegistrationPrepareRequest,
  PublicRegistrationPrepareResponse,
  PublicRegistrationPricingOption,
} from '@interface/public/PublicRegistration';

export const callGetPublicRegistrationPricing = async (eventSeq: number) => {
  const { data } = await axios.get<ApiResponse<PublicRegistrationPricingOption[]>>('/api/public/registration/pricing', {
    params: { eventSeq },
    headers: { showLoading: false },
  });
  return data;
};

export const callGetPublicRegistrationParticipant = async (email: string) => {
  const { data } = await axios.get<ApiResponse<PublicRegistrationParticipantRequest | null>>(
    '/api/public/registration/participant',
    {
      params: { email },
      headers: { showLoading: false },
    },
  );
  return data;
};

export const callValidatePublicRegistrationDiscountCode = async (request: PublicRegistrationDiscountValidationRequest) => {
  const { data } = await axios.post<ApiResponse<PublicRegistrationDiscountValidationResult>>(
    '/api/public/registration/discount/validate',
    request,
    { headers: { showLoading: false } },
  );
  return data;
};

export const callPreparePublicRegistrationPayment = async (request: PublicRegistrationPrepareRequest) => {
  const { data } = await axios.post<ApiResponse<PublicRegistrationPrepareResponse>>(
    '/api/public/registration/payment/prepare',
    request,
  );
  return data;
};

export const callGetPublicRegistrationPaymentResult = async (orderId: string) => {
  const { data } = await axios.get<ApiResponse<PublicRegistrationPaymentResult>>('/api/public/registration/payment/result', {
    params: { orderId },
    headers: { showLoading: false },
  });
  return data;
};
