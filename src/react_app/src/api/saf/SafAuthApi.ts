import axios from 'axios';
import { SignupRequest } from '@interface/saf/SafAuth';

const BASE = '/api/public/saf';

export const callSignup = async (data: SignupRequest) => {
  const res = await axios.post(`${BASE}/signup`, data);
  return res.data;
};

export const callCheckUserId = async (userId: string) => {
  const res = await axios.get(`${BASE}/check-user-id`, { params: { userId } });
  return res.data;
};

export const callCheckEmail = async (email: string) => {
  const res = await axios.get(`${BASE}/check-email`, { params: { email } });
  return res.data;
};

export const callSendEmailCode = async (email: string) => {
  const res = await axios.post(`${BASE}/send-email-code`, { email });
  return res.data;
};

export const callVerifyEmailCode = async (email: string, code: string) => {
  const res = await axios.post(`${BASE}/verify-email-code`, { email, code });
  return res.data;
};
