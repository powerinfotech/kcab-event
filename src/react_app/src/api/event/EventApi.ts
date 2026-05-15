import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  EventListItem,
  EventDetail,
  EventListSearchParam,
  EventPageComponentCatalog,
  EventSaveRequest,
  PublicEventPage,
} from '@interface/event/EventManagement';

export const callGetEventList = async (param: EventListSearchParam = {}) => {
  const { data } = await axios.get<ApiResponse<EventListItem[]>>('/api/event/list', {
    params: param,
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
  const { data } = await axios.post<ApiResponse<number>>('/api/event/save', saveDto);
  return data;
};

export const callRequestEventApproval = async (eventSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/request-approval', null, {
    params: { eventSeq },
  });
  return data;
};

export const callCancelEventApproval = async (eventSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/cancel-approval', null, {
    params: { eventSeq },
  });
  return data;
};

export const callApproveEvent = async (eventSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/approve', null, {
    params: { eventSeq },
  });
  return data;
};

export const callRejectEvent = async (eventSeq: number, rejectionReason: string) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/reject', { rejectionReason }, {
    params: { eventSeq },
  });
  return data;
};

export const callDeleteEvent = async (eventSeq: number) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/event/delete', null, {
    params: { eventSeq },
  });
  return data;
};

export const callGetEventPageBuilderCatalog = async () => {
  const { data } = await axios.get<ApiResponse<EventPageComponentCatalog>>('/api/event/page-builder/catalog');
  return data;
};

export const callGetEventPageBuilder = async (eventSeq: number) => {
  const { data } = await axios.get<ApiResponse<PublicEventPage>>('/api/event/page-builder', {
    params: { eventSeq },
  });
  return data;
};

export const callSaveEventPageBuilder = async (saveDto: PublicEventPage) => {
  const { data } = await axios.post<ApiResponse<PublicEventPage>>('/api/event/page-builder/save', saveDto);
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

export const callGetPublicEventPage = async (urlSlug: string) => {
  const { data } = await axios.get<ApiResponse<PublicEventPage>>('/api/public/event/page', {
    params: { urlSlug },
    headers: { showLoading: false },
  });
  return data;
};
