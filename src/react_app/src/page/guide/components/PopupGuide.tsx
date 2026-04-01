import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import CustomFormPopup from '@component/popup/CustomFormPopup';
import CustomSearchPopup from '@component/popup/CustomSearchPopup';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import CustomInput from '@component/input/CustomInput';
import CustomSelect from '@component/select/CustomSelect';
import CustomTable from '@component/display/CustomTable';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

/* ──────────────────────────────────
   FormPopup 샘플
────────────────────────────────── */
interface UserFormValues {
  userName: string;
  dept: string;
}

const deptOptions = [
  { value: 'DEV', label: '개발팀' },
  { value: 'HR',  label: '인사팀' },
  { value: 'FIN', label: '재무팀' },
];

/* ──────────────────────────────────
   SearchPopup 샘플
────────────────────────────────── */
interface SearchRow {
  id: number;
  name: string;
  dept: string;
  email: string;
}

const allUsers: SearchRow[] = [
  { id: 1, name: '홍길동', dept: '개발팀', email: 'hong@example.com' },
  { id: 2, name: '김철수', dept: '인사팀', email: 'kim@example.com' },
  { id: 3, name: '이영희', dept: '재무팀', email: 'lee@example.com' },
  { id: 4, name: '박지민', dept: '기획팀', email: 'park@example.com' },
  { id: 5, name: '최수진', dept: '개발팀', email: 'choi@example.com' },
];

const searchColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: '10%', align: 'center' as const },
  { title: '이름', dataIndex: 'name', key: 'name', width: '20%' },
  { title: '부서', dataIndex: 'dept', key: 'dept', width: '20%' },
  { title: '이메일', dataIndex: 'email', key: 'email' },
];

/* ──────────────────────────────────
   PopupGuide Component
────────────────────────────────── */
const PopupGuide = () => {
  const [messageApi, contextHolder] = message.useMessage();

  /* FormPopup */
  const [formPopupOpen, setFormPopupOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm<UserFormValues>({
    defaultValues: { userName: '', dept: '' },
  });
  const deptValue = watch('dept');

  const handleFormSave = (values: UserFormValues) => {
    messageApi.success(`저장 완료 — 이름: ${values.userName}, 부서: ${values.dept}`);
    reset();
    setFormPopupOpen(false);
  };

  /* SearchPopup */
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState<SearchRow[]>(allUsers);
  const [selectedRow, setSelectedRow] = useState<SearchRow | null>(null);

  const handleSearch = () => {
    const filtered = allUsers.filter(
      (u) => u.name.includes(keyword) || u.dept.includes(keyword)
    );
    setSearchResult(filtered);
  };

  const handleSearchOk = () => {
    if (!selectedRow) {
      messageApi.warning('항목을 선택해주세요.');
      return;
    }
    messageApi.success(`선택: ${selectedRow.name} (${selectedRow.dept})`);
    setSearchPopupOpen(false);
    setSelectedRow(null);
    setKeyword('');
    setSearchResult(allUsers);
  };

  return (
    <GuideSection
      id="popup"
      title="팝업 컴포넌트 (Popup)"
      description="폼 입력 팝업, 검색 팝업 등 공통 팝업 레이아웃 컴포넌트"
    >
      {contextHolder}

      {/* CustomFormPopup */}
      <GuideDemoBox title="FormPopup (폼 입력 팝업)">
        <GuideStatusItem label="기본">
          <CustomButton type="primary" onClick={() => setFormPopupOpen(true)}>
            사용자 등록 팝업 열기
          </CustomButton>
        </GuideStatusItem>

        <CustomFormPopup
          title="사용자 등록"
          open={formPopupOpen}
          onSubmit={handleSubmit(handleFormSave)}
          onCancel={() => { reset(); setFormPopupOpen(false); }}
          width={480}
        >
          <form>
            <table className="form-table">
              <tbody>
                <tr>
                  <th className="required">이름</th>
                  <td>
                    <CustomInput
                      placeholder="이름을 입력하세요"
                      {...register('userName')}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="required">부서</th>
                  <td>
                    <CustomSelect
                      placeholder="부서를 선택하세요"
                      options={deptOptions}
                      value={deptValue || undefined}
                      onChange={(val) => setValue('dept', val)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </CustomFormPopup>

        <div className="guide-demo-description">
          react-hook-form handleSubmit을 onSubmit에 그대로 전달 / maskClosable=false, destroyOnHidden=true 기본 적용 /
          OK 버튼 클릭 시 폼 유효성 검사 후 저장 핸들러 호출
        </div>
      </GuideDemoBox>

      {/* CustomSearchPopup */}
      <GuideDemoBox title="SearchPopup (검색 팝업)">
        <GuideStatusRow>
          <GuideStatusItem label="선택된 항목">
            {selectedRow ? (
              <span style={{ fontSize: 13 }}>
                {selectedRow.name} ({selectedRow.dept})
              </span>
            ) : (
              <span style={{ fontSize: 13, color: '#aaa' }}>선택된 항목 없음</span>
            )}
          </GuideStatusItem>
        </GuideStatusRow>
        <div style={{ marginTop: 8 }}>
          <CustomButton type="primary" onClick={() => setSearchPopupOpen(true)}>
            사용자 검색 팝업 열기
          </CustomButton>
        </div>

        <CustomSearchPopup
          title="사용자 검색"
          open={searchPopupOpen}
          onOk={handleSearchOk}
          onCancel={() => {
            setSearchPopupOpen(false);
            setKeyword('');
            setSearchResult(allUsers);
            setSelectedRow(null);
          }}
          tableTitle="조회 결과"
          totalCount={searchResult.length}
          searchSection={
            <CustomSpace>
              <CustomInput
                placeholder="이름 또는 부서로 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                style={{ width: 220 }}
              />
              <CustomButton type="primary" onClick={handleSearch}>조회</CustomButton>
            </CustomSpace>
          }
        >
          <CustomTable
            rowKey="id"
            columns={searchColumns}
            dataSource={searchResult}
            pagination={false}
            scroll={{ y: 240 }}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRow ? [selectedRow.id] : [],
              onChange: (_, rows) => setSelectedRow(rows[0] ?? null),
            }}
            onRow={(record) => ({
              onDoubleClick: () => {
                setSelectedRow(record as SearchRow);
                handleSearchOk();
              },
            })}
          />
        </CustomSearchPopup>

        <div className="guide-demo-description">
          검색 조건(searchSection) + 결과 테이블 레이아웃 제공 / 더블클릭 즉시 선택 지원 /
          tableTitle + totalCount로 건수 자동 표시 / 기본 너비 650px
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default PopupGuide;
