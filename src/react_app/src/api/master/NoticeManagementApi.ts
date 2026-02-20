import axios from 'axios';
import {Notice, NoticeListSearchParam} from "@interface/master/NoticeManagement";
import {callGetNationAddrNoStateSearch} from "@api/code/NationAddrNoStateApi";
import {ApiResponse} from "@interface/common";

export const callGetNoticeManagementStateSearch = async ()=>{
  const {data} = await axios.get('api/notice-mgt/search-conditions');
  return data;
};

export const callGetNoticeList = async (param: NoticeListSearchParam)=>{
  const {data} = await axios.get<ApiResponse<Notice>>('api/notice-mgt/notice-list',{params:param});
  return data;
};

export const callSaveNotice = async (param:Notice|undefined)=>{
  const {data} = await axios.post<ApiResponse<number>>('api/notice-mgt/notice-save', param);
  return data;
};

export const callDeleteNotice = async (noticeSeq:number)=>{
  const {data} = await axios.post<ApiResponse<boolean>>('api/notice-mgt/notice-delete',{noticeSeq:noticeSeq});
  return data;
};

