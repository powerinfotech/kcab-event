import axios from 'axios';
import { ApiResponse } from '@interface/common';
import {
  ParticipantEventOption,
  ParticipantListItem,
  ParticipantListSearchParam,
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
