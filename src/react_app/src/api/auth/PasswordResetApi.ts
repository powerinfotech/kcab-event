import axios from 'axios';
import {ApiResponse} from '@interface/common';

const BASE_URL = '/api/password-reset';

export interface PasswordResetSendCodeParam {
  userId: string;
  email: string;
}

export interface PasswordResetVerifyCodeParam {
  code: string;
}

export interface PasswordResetChangePasswordParam {
  password: string;
  passwordConfirm: string;
}

export const callSendPasswordResetCode = async (param: PasswordResetSendCodeParam) => {
  const {data} = await axios.post<ApiResponse<void>>(`${BASE_URL}/send-code`, param);
  return data;
};

export const callVerifyPasswordResetCode = async (param: PasswordResetVerifyCodeParam) => {
  const {data} = await axios.post<ApiResponse<void>>(`${BASE_URL}/verify-code`, param);
  return data;
};

export const callChangeForgotPassword = async (param: PasswordResetChangePasswordParam) => {
  const {data} = await axios.post<ApiResponse<void>>(`${BASE_URL}/change-password`, param);
  return data;
};
