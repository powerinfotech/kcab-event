import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  ParticipantEventTypeSaveItem,
  ParticipantEventOption,
  ParticipantListItem,
  ParticipantListSearchParam,
  ParticipantTypeOption,
} from '@interface/admin/ParticipantManagement';

function csv<T>(values?: T[]): string | undefined {
  return values && values.length ? values.join(',') : undefined;
}

export const callGetParticipantList = async (param: ParticipantListSearchParam = {}) => {
  const { data } = await axios.get<ApiResponse<ParticipantListItem[]>>('/api/admin/participants', {
    params: {
      keyword: param.keyword,
      eventSeqs: csv(param.eventSeqs),
      statuses: csv(param.statuses),
    },
  });
  return data;
};

export const callGetParticipantEventOptions = async () => {
  const { data } = await axios.get<ApiResponse<ParticipantEventOption[]>>('/api/admin/participants/events');
  return data;
};

export const callGetParticipantTypeOptions = async () => {
  const { data } = await axios.get<ApiResponse<ParticipantTypeOption[]>>('/api/admin/participants/participant-types');
  return data;
};

export const callSaveParticipantEventTypes = async (
  participantSeq: number,
  items: ParticipantEventTypeSaveItem[],
) => {
  const { data } = await axios.put<ApiResponse<void>>(
    `/api/admin/participants/${participantSeq}/event-types`,
    items,
  );
  return data;
};
