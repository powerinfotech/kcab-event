import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { message, Modal } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import CustomTable from '@component/display/CustomTable';
import CustomButton from '@component/button/CustomButton';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomRichEditor from '@component/special/CustomRichEditor';
import MenuButtonBar from '@component/special/MenuButtonBar';
import { MenuBtnDetail, PageButtonHandlers, IudType } from '@interface/common';
import {
  PageListItem,
  PageDetail,
  PageSection,
  SectionType,
  SECTION_TYPE_LABELS,
  PageSaveRequest,
} from '@interface/page/PageManagement';
import { callGetPageList, callGetPageDetail, callSavePage, callDeletePage } from '@api/page/PageApi';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';
import { useMessage } from '@hook/useMessage';

const SECTION_TYPE_OPTIONS = Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

interface SectionFormData {
  sectionType: SectionType;
  sectionData: string;
  sortSeq: number;
  useYn: string;
}

const DEFAULT_SECTION_DATA: Record<SectionType, string> = {
  HERO: JSON.stringify({ title: '', subtitle: '', backgroundImage: '', size: 'medium' }, null, 2),
  TEXT: JSON.stringify({ title: '', content: '<p></p>', size: 'medium' }, null, 2),
  IMAGE: JSON.stringify({ imageUrl: '', alt: '', caption: '', size: 'medium' }, null, 2),
  IMAGE_SLIDER: JSON.stringify({ images: [], autoPlay: true }, null, 2),
  CARD_LIST: JSON.stringify({ title: '', cards: [], columns: 3 }, null, 2),
  SPEAKER_LIST: JSON.stringify({ title: '', speakers: [] }, null, 2),
  VIDEO: JSON.stringify({ title: '', videoUrl: '', thumbnailUrl: '' }, null, 2),
  MAP: JSON.stringify({ title: '', address: '', lat: 37.5, lng: 127.0, description: '' }, null, 2),
  BANNER_LIST: JSON.stringify({ banners: [] }, null, 2),
  EVENT_INFO: JSON.stringify({ title: '', date: '', location: '', description: '', registrationUrl: '' }, null, 2),
};

const PageManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = useMessage();
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);
  const [pageList, setPageList] = useState<PageListItem[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageDetail | null>(null);
  const [sections, setSections] = useState<(PageSection & { _tempKey?: number })[]>([]);
  const [editingSectionIdx, setEditingSectionIdx] = useState<number | null>(null);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionFormData>({
    sectionType: 'TEXT',
    sectionData: DEFAULT_SECTION_DATA.TEXT,
    sortSeq: 0,
    useYn: 'Y',
  });

  const { control, register, reset, handleSubmit, setValue, getValues } = useForm<{
    pageNm: string;
    pageUrl: string;
    pageTitle: string;
    pageDesc: string;
    useYn: string;
    sortSeq: number;
  }>();

  let tempKeyCounter = useRef(0);

  const fetchPageList = useCallback(async () => {
    const res = await callGetPageList();
    if (res?.code === HttpStatusCode.Ok) {
      setPageList(res.item ?? []);
    }
  }, []);

  useEffect(() => {
    fetchPageList();
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
  }, [fetchPageList]);

  const handleInit = () => {
    setSelectedPage(null);
    setSections([]);
    reset({ pageNm: '', pageUrl: '', pageTitle: '', pageDesc: '', useYn: 'Y', sortSeq: 0 });
  };

  const handleSearch = () => {
    fetchPageList();
  };

  const handleAdd = () => {
    handleInit();
  };

  const handleSave = handleSubmit(async (formData) => {
    if (!formData.pageNm) {
      messageApi.warning('페이지 이름을 입력해주세요.');
      return;
    }
    if (!formData.pageUrl) {
      messageApi.warning('페이지 URL을 입력해주세요.');
      return;
    }

    const saveData: PageSaveRequest = {
      pageSeq: selectedPage?.pageSeq,
      pageNm: formData.pageNm,
      pageUrl: formData.pageUrl.startsWith('/') ? formData.pageUrl : `/${formData.pageUrl}`,
      pageTitle: formData.pageTitle,
      pageDesc: formData.pageDesc,
      useYn: formData.useYn ?? 'Y',
      sortSeq: formData.sortSeq ?? 0,
      sections: sections.map((s, i) => ({
        ...s,
        sortSeq: i,
        iudType: s.iudType ?? (s.sectionSeq ? undefined : IudType.I),
      })).filter((s) => s.iudType),
    };

    const res = await callSavePage(saveData);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('저장되었습니다.');
      fetchPageList();
      handleInit();
    }
  });

  const handleDelete = async () => {
    if (!selectedPage?.pageSeq) {
      messageApi.warning('삭제할 페이지를 선택해주세요.');
      return;
    }
    if (!await confirm('페이지를 삭제하시겠습니까?')) return;

    const res = await callDeletePage(selectedPage.pageSeq);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('삭제되었습니다.');
      fetchPageList();
      handleInit();
    }
  };

  const handlersRef = useRef<PageButtonHandlers>({
    cfmInit: handleInit,
    cfmSearch: handleSearch,
    cfmAdd: handleAdd,
    cfmSave: handleSave,
    cfmDelete: handleDelete,
  });

  useEffect(() => {
    handlersRef.current = {
      cfmInit: handleInit,
      cfmSearch: handleSearch,
      cfmAdd: handleAdd,
      cfmSave: handleSave,
      cfmDelete: handleDelete,
    };
  });

  const handleRowClick = async (record: PageListItem) => {
    const res = await callGetPageDetail(record.pageSeq);
    if (res?.code === HttpStatusCode.Ok && res.item) {
      const page = res.item;
      setSelectedPage(page);
      reset({
        pageNm: page.pageNm,
        pageUrl: page.pageUrl,
        pageTitle: page.pageTitle ?? '',
        pageDesc: page.pageDesc ?? '',
        useYn: page.useYn,
        sortSeq: page.sortSeq ?? 0,
      });
      setSections(page.sections ?? []);
    }
  };

  // ─── Section 관리 ───
  const openAddSection = () => {
    setEditingSectionIdx(null);
    setSectionForm({
      sectionType: 'TEXT',
      sectionData: DEFAULT_SECTION_DATA.TEXT,
      sortSeq: sections.length,
      useYn: 'Y',
    });
    setSectionModalOpen(true);
  };

  const openEditSection = (idx: number) => {
    const s = sections[idx];
    setEditingSectionIdx(idx);
    setSectionForm({
      sectionType: s.sectionType,
      sectionData: s.sectionData,
      sortSeq: s.sortSeq,
      useYn: s.useYn,
    });
    setSectionModalOpen(true);
  };

  const handleSectionSave = () => {
    try {
      JSON.parse(sectionForm.sectionData);
    } catch {
      messageApi.error('섹션 데이터가 올바른 JSON 형식이 아닙니다.');
      return;
    }

    if (editingSectionIdx !== null) {
      setSections((prev) =>
        prev.map((s, i) =>
          i === editingSectionIdx
            ? {
                ...s,
                sectionType: sectionForm.sectionType,
                sectionData: sectionForm.sectionData,
                sortSeq: sectionForm.sortSeq,
                useYn: sectionForm.useYn,
                iudType: s.sectionSeq ? IudType.U : IudType.I,
              }
            : s
        )
      );
    } else {
      setSections((prev) => [
        ...prev,
        {
          sectionType: sectionForm.sectionType,
          sectionData: sectionForm.sectionData,
          sortSeq: sections.length,
          useYn: sectionForm.useYn,
          iudType: IudType.I,
          _tempKey: tempKeyCounter.current++,
        },
      ]);
    }

    setSectionModalOpen(false);
  };

  const handleRemoveSection = (idx: number) => {
    const s = sections[idx];
    if (s.sectionSeq) {
      setSections((prev) =>
        prev.map((sec, i) => (i === idx ? { ...sec, iudType: IudType.D } : sec))
      );
    } else {
      setSections((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sections.length) return;
    setSections((prev) => {
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((s, i) => ({
        ...s,
        sortSeq: i,
        iudType: s.iudType ?? (s.sectionSeq ? IudType.U : IudType.I),
      }));
    });
  };

  const pageColumns = [
    { title: 'No', dataIndex: 'pageSeq', key: 'pageSeq', width: '8%', align: 'center' as const },
    { title: '페이지 이름', dataIndex: 'pageNm', key: 'pageNm', width: '20%' },
    { title: 'URL', dataIndex: 'pageUrl', key: 'pageUrl', width: '20%' },
    { title: '타이틀', dataIndex: 'pageTitle', key: 'pageTitle', width: '20%' },
    { title: '섹션 수', dataIndex: 'sectionCount', key: 'sectionCount', width: '10%', align: 'center' as const },
    { title: '사용', dataIndex: 'useYn', key: 'useYn', width: '8%', align: 'center' as const },
    { title: '정렬', dataIndex: 'sortSeq', key: 'sortSeq', width: '8%', align: 'center' as const },
  ];

  const visibleSections = sections.filter((s) => s.iudType !== IudType.D);

  return (
    <div style={{ padding: '16px' }}>
      {contextHolder}
      <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />

      {/* 페이지 목록 */}
      <div style={{ marginBottom: 24 }}>
        <CustomTable
          rowKey="pageSeq"
          columns={pageColumns}
          dataSource={pageList}
          pagination={false}
          scroll={{ y: 240 }}
          onRow={(record: PageListItem) => ({
            onClick: () => handleRowClick(record),
            style: {
              cursor: 'pointer',
              background: selectedPage?.pageSeq === record.pageSeq ? '#e6f4ff' : undefined,
            },
          })}
        />
      </div>

      {/* 페이지 상세 폼 */}
      <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
          {selectedPage ? '페이지 수정' : '새 페이지'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>페이지 이름 *</label>
            <Controller name="pageNm" control={control} render={({ field }) => (
              <CustomInput {...field} placeholder="예: About" />
            )} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>URL *</label>
            <Controller name="pageUrl" control={control} render={({ field }) => (
              <CustomInput {...field} placeholder="예: /about" />
            )} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>브라우저 타이틀</label>
            <Controller name="pageTitle" control={control} render={({ field }) => (
              <CustomInput {...field} placeholder="예: About - KCAB INTERNATIONAL" />
            )} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>사용 여부</label>
              <Controller name="useYn" control={control} render={({ field }) => (
                <CustomSelect {...field} options={USE_YN_OPTIONS} style={{ width: '100%' }} />
              )} />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>정렬</label>
              <Controller name="sortSeq" control={control} render={({ field }) => (
                <CustomInput type="number" {...field} />
              )} />
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>설명 (SEO)</label>
            <Controller name="pageDesc" control={control} render={({ field }) => (
              <CustomInput {...field} placeholder="페이지 설명" />
            )} />
          </div>
        </div>
      </div>

      {/* 섹션 관리 */}
      <div style={{ background: '#fafafa', padding: 20, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
            섹션 목록 ({visibleSections.length})
          </h4>
          <CustomButton type="primary" icon={<PlusOutlined />} onClick={openAddSection}>
            섹션 추가
          </CustomButton>
        </div>

        {visibleSections.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
            섹션이 없습니다. "섹션 추가" 버튼을 눌러 추가해주세요.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleSections.map((section, idx) => {
              const realIdx = sections.indexOf(section);
              let title = '';
              try {
                const parsed = JSON.parse(section.sectionData);
                title = parsed.title || '';
              } catch { /* ignore */ }

              return (
                <div
                  key={section.sectionSeq ?? section._tempKey ?? idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    background: '#fff',
                    borderRadius: 6,
                    border: '1px solid #e8e8e8',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#294DC7', minWidth: 100 }}>
                    {SECTION_TYPE_LABELS[section.sectionType] ?? section.sectionType}
                  </span>
                  <span style={{ flex: 1, fontSize: 13, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title || '(제목 없음)'}
                  </span>
                  <span style={{ fontSize: 12, color: section.useYn === 'Y' ? '#52c41a' : '#999' }}>
                    {section.useYn === 'Y' ? '사용' : '미사용'}
                  </span>
                  <CustomButton size="small" icon={<ArrowUpOutlined />} onClick={() => moveSection(realIdx, -1)} disabled={idx === 0} />
                  <CustomButton size="small" icon={<ArrowDownOutlined />} onClick={() => moveSection(realIdx, 1)} disabled={idx === visibleSections.length - 1} />
                  <CustomButton size="small" icon={<EditOutlined />} onClick={() => openEditSection(realIdx)} />
                  <CustomButton size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemoveSection(realIdx)} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 섹션 편집 모달 */}
      <Modal
        title={editingSectionIdx !== null ? '섹션 수정' : '섹션 추가'}
        open={sectionModalOpen}
        onOk={handleSectionSave}
        onCancel={() => setSectionModalOpen(false)}
        width={800}
        okText="확인"
        cancelText="취소"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>섹션 유형</label>
              <CustomSelect
                value={sectionForm.sectionType}
                onChange={(val: SectionType) => {
                  setSectionForm((prev) => ({
                    ...prev,
                    sectionType: val,
                    sectionData: DEFAULT_SECTION_DATA[val],
                  }));
                }}
                options={SECTION_TYPE_OPTIONS}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>사용 여부</label>
              <CustomSelect
                value={sectionForm.useYn}
                onChange={(val: string) => setSectionForm((prev) => ({ ...prev, useYn: val }))}
                options={USE_YN_OPTIONS}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>
              섹션 데이터 (JSON)
            </label>
            <textarea
              value={sectionForm.sectionData}
              onChange={(e) => setSectionForm((prev) => ({ ...prev, sectionData: e.target.value }))}
              style={{
                width: '100%',
                minHeight: 300,
                fontFamily: 'monospace',
                fontSize: 13,
                padding: 12,
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PageManagement;
