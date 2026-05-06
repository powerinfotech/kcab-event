import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomTable from '@component/display/CustomTable';
import CustomButton from '@component/button/CustomButton';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import MenuButtonBar from '@component/special/MenuButtonBar';
import { MenuBtnDetail, PageButtonHandlers, IudType } from '@interface/common';
import { FaqItem, FaqSaveRequest } from '@interface/faq/FaqManagement';
import { callGetFaqList, callSaveFaq } from '@api/faq/FaqApi';
import { callGetMenuBtnList } from '@api/CommonApi';
import { HttpStatusCode } from 'axios';

const USE_YN_OPTIONS = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const FaqManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [menuBtnList, setMenuBtnList] = useState<MenuBtnDetail[]>([]);
  const [faqList, setFaqList] = useState<(FaqItem & { _key: number })[]>([]);
  let keyCounter = useRef(0);

  const fetchList = useCallback(async () => {
    const res = await callGetFaqList();
    if (res?.code === HttpStatusCode.Ok) {
      setFaqList((res.item ?? []).map((item) => ({
        ...item,
        _key: keyCounter.current++,
      })));
    }
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
      ]);
    });
  }, [fetchList]);

  const handleAdd = () => {
    setFaqList((prev) => [...prev, {
      category: '',
      question: '',
      answer: '',
      sortSeq: prev.length,
      useYn: 'Y',
      iudType: IudType.I,
      _key: keyCounter.current++,
    }]);
  };

  const handleFieldChange = (key: number, field: string, value: string | number) => {
    setFaqList((prev) => prev.map((item) => {
      if (item._key !== key) return item;
      return {
        ...item,
        [field]: value,
        iudType: item.iudType ?? (item.faqSeq ? IudType.U : IudType.I),
      };
    }));
  };

  const handleRemove = (key: number) => {
    setFaqList((prev) => {
      const item = prev.find((f) => f._key === key);
      if (!item) return prev;
      if (item.faqSeq) {
        return prev.map((f) => f._key === key ? { ...f, iudType: IudType.D } : f);
      }
      return prev.filter((f) => f._key !== key);
    });
  };

  const handleSave = async () => {
    const toSave = faqList.filter((f) => f.iudType);
    if (toSave.length === 0) { messageApi.info('변경된 내용이 없습니다.'); return; }

    const saveData: FaqSaveRequest = { faqList: toSave };
    const res = await callSaveFaq(saveData);
    if (res?.code === HttpStatusCode.Ok) {
      messageApi.success('저장되었습니다.');
      fetchList();
    }
  };

  const handlersRef = useRef<PageButtonHandlers>({});
  useEffect(() => {
    handlersRef.current = {
      cfmInit: fetchList,
      cfmSearch: fetchList,
      cfmAdd: handleAdd,
      cfmSave: handleSave,
    };
  });

  const visibleList = faqList.filter((f) => f.iudType !== IudType.D);

  const columns = [
    { title: 'No', width: '6%', align: 'center' as const,
      render: (_: unknown, __: unknown, idx: number) => idx + 1 },
    { title: '카테고리', dataIndex: 'category', key: 'category', width: '12%',
      render: (v: string, record: FaqItem & { _key: number }) => (
        <CustomInput value={v} onChange={(e) => handleFieldChange(record._key, 'category', e.target.value)} />
      ),
    },
    { title: '질문', dataIndex: 'question', key: 'question', width: '30%',
      render: (v: string, record: FaqItem & { _key: number }) => (
        <CustomInput value={v} onChange={(e) => handleFieldChange(record._key, 'question', e.target.value)} />
      ),
    },
    { title: '답변', dataIndex: 'answer', key: 'answer', width: '30%',
      render: (v: string, record: FaqItem & { _key: number }) => (
        <CustomInput value={v} onChange={(e) => handleFieldChange(record._key, 'answer', e.target.value)} />
      ),
    },
    { title: '사용', dataIndex: 'useYn', key: 'useYn', width: '8%', align: 'center' as const,
      render: (v: string, record: FaqItem & { _key: number }) => (
        <CustomSelect value={v} options={USE_YN_OPTIONS} style={{ width: '100%' }}
          onChange={(val: string) => handleFieldChange(record._key, 'useYn', val)} />
      ),
    },
    { title: '정렬', dataIndex: 'sortSeq', key: 'sortSeq', width: '6%', align: 'center' as const,
      render: (v: number, record: FaqItem & { _key: number }) => (
        <CustomInput type="number" value={v} style={{ width: 60 }}
          onChange={(e) => handleFieldChange(record._key, 'sortSeq', Number(e.target.value))} />
      ),
    },
    { title: '', width: '6%', align: 'center' as const,
      render: (_: unknown, record: FaqItem & { _key: number }) => (
        <CustomButton size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemove(record._key)} />
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      {contextHolder}
      <MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          FAQ 추가
        </CustomButton>
      </div>

      <CustomTable
        rowKey="_key"
        columns={columns}
        dataSource={visibleList}
        pagination={false}
      />
    </div>
  );
};

export default FaqManagement;
