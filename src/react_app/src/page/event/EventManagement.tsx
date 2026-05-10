import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { message } from 'antd';
import CustomTable from '@component/display/CustomTable';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomRichEditor from '@component/special/CustomRichEditor';
import CustomDatePicker from '@component/date/CustomDatePicker';
import MenuButtonBar from '@component/special/MenuButtonBar';
import { MenuBtnDetail, PageButtonHandlers } from '@interface/common';
import { EventListItem, EventDetail, EventSaveRequest, EVENT_STATUS_LABELS } from '@interface/event/EventManagement';
import { callGetEventList, callGetEventDetail, callSaveEvent, callDeleteEvent } from '@api/event/EventApi';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import { useMessage } from '@hook/useMessage';
import dayjs from 'dayjs';

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const STATUS_OPTIONS = Object.entries(EVENT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));

const EventManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = useMessage();
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);
  const [eventList, setEventList] = useState<EventListItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [content, setContent] = useState('');

  const { control, reset, handleSubmit } = useForm<{
    title: string;
    summary: string;
    thumbnailUrl: string;
    eventStartDt: dayjs.Dayjs | null;
    eventEndDt: dayjs.Dayjs | null;
    location: string;
    registrationUrl: string;
    status: string;
    useYn: string;
  }>();

  const fetchList = useCallback(async () => {
    const res = await callGetEventList({});
    if (res?.code === HttpStatusCode.Ok) setEventList(res.item ?? []);
  }, []);

  useEffect(() => {
    fetchList();
    callGetMenuBtnList(0).then((res) => {
      if (res?.item) setMenuBtnList(res.item);
    }).catch(() => {
      setMenuBtnList([
        { btnSeq: 1, sortSeq: 1, btnFuncCd: 'cfmInit', btnNm: '초기화' },
        { btnSeq: 2, sortSeq: 2, btnFuncCd: 'cfmSearch', btnNm: '조회' },
        { btnSeq: 3, sortSeq: 3, btnFuncCd: 'cfmAdd', btnNm: '추가' },
        { btnSeq: 4, sortSeq: 4, btnFuncCd: 'cfmSave', btnNm: '저장' },
        { btnSeq: 5, sortSeq: 5, btnFuncCd: 'cfmDelete', btnNm: '삭제' },
      ]);
    });
  }, [fetchList]);

  const handleInit = () => {
    setSelectedEvent(null);
    setContent('');
    reset({ title: '', summary: '', thumbnailUrl: '', eventStartDt: null, eventEndDt: null,
      location: '', registrationUrl: '', status: 'UPCOMING', useYn: 'Y' });
  };

  const handleSave = handleSubmit(async (formData) => {
    if (!formData.title) { messageApi.warning('행사명을 입력해주세요.'); return; }
    const saveData: EventSaveRequest = {
      eventSeq: selectedEvent?.eventSeq,
      title: formData.title,
      content,
      summary: formData.summary ?? '',
      thumbnailUrl: formData.thumbnailUrl ?? '',
      eventStartDt: formData.eventStartDt?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
      eventEndDt: formData.eventEndDt?.format('YYYY-MM-DDTHH:mm:ss') ?? '',
      location: formData.location ?? '',
      registrationUrl: formData.registrationUrl ?? '',
      status: formData.status ?? 'UPCOMING',
      useYn: formData.useYn ?? 'Y',
      eventType: 'main',
    };
    const res = await callSaveEvent(saveData);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('저장되었습니다.');
      fetchList();
      handleInit();
    }
  });

  const handleDelete = async () => {
    if (!selectedEvent?.eventSeq) { messageApi.warning('삭제할 행사를 선택해주세요.'); return; }
    if (!await confirm('삭제하시겠습니까?')) return;
    const res = await callDeleteEvent(selectedEvent.eventSeq);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('삭제되었습니다.');
      fetchList();
      handleInit();
    }
  };

  const handlersRef = useRef<PageButtonHandlers>({});
  useEffect(() => {
    handlersRef.current = {
      cfmInit: handleInit,
      cfmSearch: fetchList,
      cfmAdd: handleInit,
      cfmSave: handleSave,
      cfmDelete: handleDelete,
    };
  });

  const handleRowClick = async (record: EventListItem) => {
    const res = await callGetEventDetail(record.eventSeq);
    if (res?.code === HttpStatusCode.Ok && res.item) {
      const e = res.item;
      setSelectedEvent(e);
      setContent(e.content ?? '');
      reset({
        title: e.title,
        summary: e.summary ?? '',
        thumbnailUrl: e.thumbnailUrl ?? '',
        eventStartDt: e.eventStartDt ? dayjs(e.eventStartDt) : null,
        eventEndDt: e.eventEndDt ? dayjs(e.eventEndDt) : null,
        location: e.location ?? '',
        registrationUrl: e.registrationUrl ?? '',
        status: e.status,
        useYn: e.useYn,
      });
    }
  };

  const columns = [
    { title: 'No', dataIndex: 'eventSeq', key: 'eventSeq', width: '6%', align: 'center' as const },
    { title: '행사명', dataIndex: 'title', key: 'title', width: '30%' },
    { title: '장소', dataIndex: 'location', key: 'location', width: '15%' },
    { title: '시작일', dataIndex: 'eventStartDt', key: 'eventStartDt', width: '12%', align: 'center' as const },
    { title: '종료일', dataIndex: 'eventEndDt', key: 'eventEndDt', width: '12%', align: 'center' as const },
    { title: '상태', dataIndex: 'status', key: 'status', width: '10%', align: 'center' as const,
      render: (v: string) => EVENT_STATUS_LABELS[v as keyof typeof EVENT_STATUS_LABELS] ?? v },
    { title: '사용', dataIndex: 'useYn', key: 'useYn', width: '8%', align: 'center' as const },
  ];

  return (
    <div style={{ padding: '16px' }}>
      {contextHolder}
      <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />

      <CustomTable
        rowKey="eventSeq"
        columns={columns}
        dataSource={eventList}
        pagination={false}
        scroll={{ y: 240 }}
        onRow={(record: EventListItem) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer', background: selectedEvent?.eventSeq === record.eventSeq ? '#e6f4ff' : undefined },
        })}
      />

      <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, marginTop: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
          {selectedEvent ? '행사 수정' : '새 행사'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>행사명 *</label>
            <Controller name="title" control={control} render={({ field }) => <CustomInput {...field} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>요약</label>
            <Controller name="summary" control={control} render={({ field }) => <CustomInput {...field} placeholder="목록에 표시될 요약" />} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>시작일</label>
            <Controller name="eventStartDt" control={control} render={({ field }) =>
              <CustomDatePicker {...field} style={{ width: '100%' }} />
            } />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>종료일</label>
            <Controller name="eventEndDt" control={control} render={({ field }) =>
              <CustomDatePicker {...field} style={{ width: '100%' }} />
            } />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>장소</label>
            <Controller name="location" control={control} render={({ field }) => <CustomInput {...field} />} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>참가 신청 URL</label>
            <Controller name="registrationUrl" control={control} render={({ field }) => <CustomInput {...field} />} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>썸네일 URL</label>
            <Controller name="thumbnailUrl" control={control} render={({ field }) => <CustomInput {...field} />} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>상태</label>
              <Controller name="status" control={control} render={({ field }) =>
                <CustomSelect {...field} options={STATUS_OPTIONS} style={{ width: '100%' }} />
              } />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>사용</label>
              <Controller name="useYn" control={control} render={({ field }) =>
                <CustomSelect {...field} options={USE_YN_OPTIONS} style={{ width: '100%' }} />
              } />
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>내용</label>
          <CustomRichEditor value={content} isEditable={true} onChange={setContent} height={300} />
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
