import axios from 'axios';
import { ApiResponse } from '@interface/common';
import { PopupItem, PopupSaveRequest, PopupStatus } from '@interface/popup/PopupManagement';

export interface PopupListSearchParam {
  status?: PopupStatus;
  activeOnly?: boolean;
}

export const callGetPopupList = async (param: PopupListSearchParam = {}) => {
  const { data } = await axios.get<ApiResponse<PopupItem[]>>('/api/popup/list', {
    params: param,
  });
  return data;
};

export const callSavePopup = async (saveDto: PopupSaveRequest) => {
  const { data } = await axios.post<ApiResponse<void>>('/api/popup/save', saveDto);
  return data;
};

export const callGetPublicPopupList = async () => {
  const { data } = await axios.get<ApiResponse<PopupItem[]>>('/api/public/popup/list', {
    headers: { showLoading: false },
  });
  return data;
};
