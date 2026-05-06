import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { message } from 'antd';
import CustomTable from '@component/display/CustomTable';
import CustomButton from '@component/button/CustomButton';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomRichEditor from '@component/special/CustomRichEditor';
import MenuButtonBar from '@component/special/MenuButtonBar';
import { MenuBtnDetail, PageButtonHandlers } from '@interface/common';
import { NoticeListItem, NoticeDetail, NoticeSaveRequest } from '@interface/notice/NoticeManagement';
import { callGetNoticeList, callGetNoticeDetail, callSaveNotice, callDeleteNotice } from '@api/notice/NoticeApi';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import { useMessage } from '@hook/useMessage';

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const TOP_YN_OPTIONS = [
  { value: 'Y', label: '고정' },
  { value: 'N', label: '일반' },
];

const NoticeManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = useMessage();
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeListItem[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null);
  const [searchText, setSearchText] = useState('');
  const [content, setContent] = useState('');

  const { control, reset, handleSubmit } = useForm<{
    title: string;
    topYn: string;
    useYn: string;
  }>();

  const fetchList = useCallback(async () => {
    const res = await callGetNoticeList(searchText);
    if (res?.code === HttpStatusCode.Ok) setNoticeList(res.item ?? []);
  }, [searchText]);

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
    setSelectedNotice(null);
    setContent('');
    reset({ title: '', topYn: 'N', useYn: 'Y' });
  };

  const handleSave = handleSubmit(async (formData) => {
    if (!formData.title) { messageApi.warning('제목을 입력해주세요.'); return; }
    const saveData: NoticeSaveRequest = {
      noticeSeq: selectedNotice?.noticeSeq,
      title: formData.title,
      content,
      topYn: formData.topYn ?? 'N',
      useYn: formData.useYn ?? 'Y',
    };
    const res = await callSaveNotice(saveData);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('저장되었습니다.');
      fetchList();
      handleInit();
    }
  });

  const handleDelete = async () => {
    if (!selectedNotice?.noticeSeq) { messageApi.warning('삭제할 공지를 선택해주세요.'); return; }
    if (!await confirm('삭제하시겠습니까?')) return;
    const res = await callDeleteNotice(selectedNotice.noticeSeq);
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

  const handleRowClick = async (record: NoticeListItem) => {
    const res = await callGetNoticeDetail(record.noticeSeq);
    if (res?.code === HttpStatusCode.Ok && res.item) {
      const n = res.item;
      setSelectedNotice(n);
      setContent(n.content ?? '');
      reset({ title: n.title, topYn: n.topYn, useYn: n.useYn });
    }
  };

  const columns = [
    { title: 'No', dataIndex: 'noticeSeq', key: 'noticeSeq', width: '8%', align: 'center' as const },
    { title: '제목', dataIndex: 'title', key: 'title', width: '40%' },
    { title: '작성자', dataIndex: 'rgstUserName', key: 'rgstUserName', width: '12%', align: 'center' as const },
    { title: '조회수', dataIndex: 'viewCount', key: 'viewCount', width: '10%', align: 'center' as const },
    { title: '고정', dataIndex: 'topYn', key: 'topYn', width: '8%', align: 'center' as const },
    { title: '사용', dataIndex: 'useYn', key: 'useYn', width: '8%', align: 'center' as const },
    { title: '등록일', dataIndex: 'rgstDateTime', key: 'rgstDateTime', width: '14%', align: 'center' as const,
      render: (v: string) => v?.substring(0, 10) },
  ];

  return (
    <div style={{ padding: '16px' }}>
      {contextHolder}
      <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />

      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <CustomInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="제목 검색"
          style={{ width: 300 }}
          onPressEnter={fetchList}
        />
      </div>

      <CustomTable
        rowKey="noticeSeq"
        columns={columns}
        dataSource={noticeList}
        pagination={false}
        scroll={{ y: 240 }}
        onRow={(record: NoticeListItem) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer', background: selectedNotice?.noticeSeq === record.noticeSeq ? '#e6f4ff' : undefined },
        })}
      />

      <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, marginTop: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
          {selectedNotice ? '공지사항 수정' : '새 공지사항'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px 24px', marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>제목 *</label>
            <Controller name="title" control={control} render={({ field }) => <CustomInput {...field} />} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>상단 고정</label>
            <Controller name="topYn" control={control} render={({ field }) =>
              <CustomSelect {...field} options={TOP_YN_OPTIONS} style={{ width: 100 }} />
            } />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>사용 여부</label>
            <Controller name="useYn" control={control} render={({ field }) =>
              <CustomSelect {...field} options={USE_YN_OPTIONS} style={{ width: 100 }} />
            } />
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

export default NoticeManagement;
