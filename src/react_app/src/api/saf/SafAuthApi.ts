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
