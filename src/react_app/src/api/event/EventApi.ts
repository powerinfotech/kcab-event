import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { EventListItem, EventDetail, EventSaveRequest } from '@interface/event/EventManagement';

export const callGetEventList = async (status?: string) => {
  const { data } = await axios.get<ApiResponse<EventListItem[]>>('/api/event/list', {
    params: { status },
  });
  return data;
};

export const callGetEventDetail = async (eventSeq: number) => {
  const { data } = await axios.get<ApiResponse<EventDetail>>('/api/event/detail', {
    params: { eventSeq },
  });
  return data;
};

export const callSaveEvent = async (saveDto: EventSaveRequest) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/save', saveDto);
  return data;
};

export const callDeleteEvent = async (eventSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/delete', null, {
    params: { eventSeq },
  });
  return data;
};

export const callGetPublicEventList = async (status?: string) => {
  const { data } = await axios.get<ApiResponse<EventListItem[]>>('/api/public/event/list', {
    params: { status },
    headers: { showLoading: false },
  });
  return data;
};

export const callGetPublicEventDetail = async (eventSeq: number) => {
  const { data } = await axios.get<ApiResponse<EventDetail>>('/api/public/event/detail', {
    params: { eventSeq },
    headers: { showLoading: false },
  });
  return data;
};
