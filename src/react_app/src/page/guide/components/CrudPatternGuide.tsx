import React from 'react';
import { GuideSection, GuideDemoBox } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const PAGE_LAYOUT_CODE = `// ── 기본 페이지 레이아웃 구조 ──

// 1) 페이지 헤더
<CustomPageHeader title="사용자 관리" />

// 2) 검색 영역
<div className="search-wrap">
  <form>
    <span>사용자명</span>
    <CustomInput value={searchText} onChange={(e) => setSearchText(e.target.value)} />
    <span>상태</span>
    <CustomSelect options={statusOptions} value={status} onChange={setStatus} />
    <CustomButton type="primary" onClick={handleSearch}>조회</CustomButton>
  </form>
</div>

// 3) 테이블 영역
<CustomTable
  rowNoFlag
  rowSelectedFlag
  columns={columns}
  dataSource={dataSource}
  selectedRowIndex={selectedRowIndex}
  onRow={(record, index) => ({
    onClick: () => handleRowClick(record, index),
  })}
  pagination={{ current: page, pageSize: 20, total, onChange: onPageChange }}
/>

// 4) 상세/수정 팝업
<CustomFormPopup title="사용자 등록" open={popupOpen} onSubmit={handleSubmit(handleSave)} onCancel={handleClose}>
  <form>
    <CustomSaveFormInput name="userName" control={control} title="사용자명" required />
  </form>
</CustomFormPopup>`;

const SEARCH_TABLE_CODE = `import { useForm } from 'react-hook-form';
import { usePagination } from '@hook/usePagination';

interface SearchParam {
  userName: string;
  status: string;
}

const MyPage = () => {
  const { register, handleSubmit, getValues } = useForm<SearchParam>();

  // ① usePagination으로 페이징 + 데이터 관리
  const { dataSource, pagination, loading, search, onPageChange } = usePagination(
    (params) => callGetUserList(params),
    { defaultPageSize: 20 }
  );

  // ② 검색 버튼 클릭
  const handleSearch = () => {
    const values = getValues();
    search(values); // 1페이지로 초기화 + API 호출
  };

  // ③ 엔터 키 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ④ 초기 조회
  useEffect(() => { handleSearch(); }, []);

  return (
    <>
      <div className="search-wrap">
        <form onKeyDown={handleKeyDown}>
          <span>사용자명</span>
          <CustomInput {...register('userName')} placeholder="사용자명" />
          <CustomButton type="primary" onClick={handleSearch}>조회</CustomButton>
        </form>
      </div>
      <CustomTable
        rowNoFlag
        columns={columns}
        dataSource={dataSource}
        pagination={{ ...pagination, onChange: onPageChange }}
      />
    </>
  );
};`;

const FORM_POPUP_CODE = `import { useForm } from 'react-hook-form';
import CustomFormPopup from '@component/popup/CustomFormPopup';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';

interface UserForm {
  userName: string;
  email: string;
  useYn: string;
}

const UserFormPopup = ({ open, onClose, editData, onSaved }: Props) => {
  const { control, handleSubmit, reset } = useForm<UserForm>();

  // ① 수정 모드: 팝업 열릴 때 기존 데이터 세팅
  useEffect(() => {
    if (open && editData) {
      reset(editData); // 폼 필드에 기존값 채우기
    } else if (open) {
      reset({ userName: '', email: '', useYn: 'Y' }); // 등록 모드 초기값
    }
  }, [open, editData]);

  // ② 저장 처리
  const handleSave = async (values: UserForm) => {
    if (editData) {
      await callUpdateUser({ ...values, userSeq: editData.userSeq });
    } else {
      await callInsertUser(values);
    }
    CustomNotification.success('저장 완료');
    onSaved(); // 부모에서 목록 새로고침
    onClose();
  };

  return (
    <CustomFormPopup
      title={editData ? '사용자 수정' : '사용자 등록'}
      open={open}
      onSubmit={handleSubmit(handleSave)}
      onCancel={() => { reset(); onClose(); }}
      width={500}
    >
      <form>
        <CustomSaveFormInput name="userName" control={control} title="사용자명" required
          rules={{ required: '사용자명을 입력해주세요.' }} />
        <CustomSaveFormInput name="email" control={control} title="이메일"
          rules={{ pattern: { value: /^[^@]+@[^@]+$/, message: '이메일 형식이 올바르지 않습니다.' } }} />
        <CustomSaveFormSelect name="useYn" control={control} title="사용여부" required
          options={[{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }]} />
      </form>
    </CustomFormPopup>
  );
};

// ── 부모에서 호출 ──
const [popupOpen, setPopupOpen] = useState(false);
const [editData, setEditData] = useState<UserForm | null>(null);

// 등록
const handleAdd = () => { setEditData(null); setPopupOpen(true); };
// 수정
const handleEdit = (record: UserForm) => { setEditData(record); setPopupOpen(true); };

<UserFormPopup open={popupOpen} onClose={() => setPopupOpen(false)}
  editData={editData} onSaved={() => handleSearch()} />`;

const DELETE_CONFIRM_CODE = `import { useMessage } from '@hook/useMessage';
import CustomNotification from '@component/feedback/CustomNotification';

const { confirm } = useMessage();

// ① 단건 삭제
const handleDelete = async (record: UserList) => {
  const isOk = await confirm('선택한 사용자를 삭제하시겠습니까?');
  if (!isOk) return;

  const res = await callDeleteUser(record.userSeq);
  if (res.code === 200) {
    CustomNotification.success('삭제 완료');
    handleSearch(); // 목록 새로고침
  }
};

// ② 다건 삭제 (체크박스 선택)
const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

const handleBulkDelete = async () => {
  if (selectedKeys.length === 0) {
    await alert('삭제할 항목을 선택해주세요.');
    return;
  }
  const isOk = await confirm(\`선택한 \${selectedKeys.length}건을 삭제하시겠습니까?\`);
  if (!isOk) return;

  await callBulkDeleteUsers(selectedKeys);
  CustomNotification.success(\`\${selectedKeys.length}건 삭제 완료\`);
  setSelectedKeys([]);
  handleSearch();
};

// ③ 테이블에서 행 삭제 버튼
const columns = [
  // ...기타 컬럼
  {
    title: '관리',
    render: (_, record) => (
      <CustomPopconfirm
        title="삭제 확인"
        description="이 항목을 삭제하시겠습니까?"
        onConfirm={() => handleDelete(record)}
      >
        <CustomButton size="small" danger>삭제</CustomButton>
      </CustomPopconfirm>
    ),
  },
];`;

const PAGE_HANDLERS_CODE = `import { useRef } from 'react';
import { usePageHandlers } from '@hook/usePageHandlers';
import MenuButtonBar from '@component/special/MenuButtonBar';

// ① handlersRef 정의 (버튼코드 → 핸들러 매핑)
const handlersRef = useRef<PageButtonHandlers>({});

// ② usePageHandlers로 핸들러 등록
usePageHandlers(handlersRef, {
  cfmInit:   handleReset,        // 초기화 버튼
  cfmSearch: handleSearch,       // 조회 버튼
  cfmAdd:    handleAdd,          // 등록 버튼
  cfmSave:   saveForm.handleSubmit(handleSave), // 저장 버튼
  cfmDelete: handleDelete,       // 삭제 버튼
});

// ③ MenuButtonBar 배치 (메뉴 권한에 따라 버튼 자동 표시)
<MenuButtonBar menuBtnList={menuInfo?.menuBtnList ?? []} handlersRef={handlersRef} />

// 버튼 코드 목록:
// cfmInit   → 초기화 (RefreshIcon)
// cfmSearch → 조회 (SearchIcon)
// cfmAdd    → 등록 (PlusIcon)
// cfmSave   → 저장 (SaveIcon)
// cfmDelete → 삭제 (DeleteIcon)
// cfmExcel  → 엑셀 (ExcelIcon)`;

const API_CALL_CODE = `import axios from 'axios';

// ── API Response 구조 ──
interface ApiResponse<T> {
  code: number;      // HTTP 상태 코드 (200, 400, 500...)
  item: T;           // 응답 데이터
  message?: string;  // 메시지 (에러 시)
}

// ── API 함수 작성 패턴 ──

// ① 목록 조회 (GET)
export const callGetUserList = async (params: SearchParam) => {
  const { data } = await axios.get<ApiResponse<UserList[]>>('/api/user/list', { params });
  return data;
};

// ② 상세 조회 (GET)
export const callGetUserDetail = async (userSeq: number) => {
  const { data } = await axios.get<ApiResponse<UserDetail>>(\`/api/user/\${userSeq}\`);
  return data;
};

// ③ 저장 (POST)
export const callSaveUser = async (body: UserForm) => {
  const { data } = await axios.post<ApiResponse<any>>('/api/user/save', body);
  return data;
};

// ④ 삭제 (POST)
export const callDeleteUser = async (userSeq: number) => {
  const { data } = await axios.post<ApiResponse<any>>('/api/user/delete', { userSeq });
  return data;
};

// ⑤ 파일 업로드 (FormData)
export const callUploadFile = async (file: File, menuSeq: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('menuSeq', String(menuSeq));
  const { data } = await axios.post<ApiResponse<any>>('/api/file/upload', formData);
  return data;
};

// ⑥ 로딩 스피너 제어
// headers: { showLoading: false } → 글로벌 로딩 스피너 표시 안 함
const { data } = await axios.get('/api/check', { headers: { showLoading: false } });

// ── 페이지에서 사용 ──
const handleSearch = async () => {
  const res = await callGetUserList(searchParams);
  if (res.code === 200) {
    setDataSource(res.item);
  }
};

const handleSave = async (values: UserForm) => {
  try {
    const res = await callSaveUser(values);
    if (res.code === 200) {
      CustomNotification.success('저장 완료');
      handleSearch(); // 목록 새로고침
    }
  } catch (error) {
    // axios 인터셉터가 글로벌 에러 처리
    // 추가 처리가 필요하면 여기서
  }
};`;

const CrudPatternGuide = () => {
  return (
    <GuideSection id="crud-pattern" title="CRUD 패턴 가이드" description="관리 화면의 CRUD 구현 패턴 및 코드 예제">
      {/* 페이지 레이아웃 구조 */}
      <GuideDemoBox title="페이지 레이아웃 구조" codeExample={PAGE_LAYOUT_CODE}>
        <div className="guide-demo-description">
          일반적인 관리 화면의 레이아웃 구조
        </div>
      </GuideDemoBox>

      {/* 검색 → 테이블 표시 */}
      <GuideDemoBox title="검색 → 테이블 표시" codeExample={SEARCH_TABLE_CODE}>
        <div className="guide-demo-description">
          react-hook-form으로 검색 조건 관리 → API 호출 → 테이블에 결과 표시
        </div>
      </GuideDemoBox>

      {/* 등록/수정 팝업 */}
      <GuideDemoBox title="등록/수정 팝업" codeExample={FORM_POPUP_CODE}>
        <div className="guide-demo-description">
          CustomFormPopup + react-hook-form으로 등록/수정 처리
        </div>
      </GuideDemoBox>

      {/* 삭제 + 확인 */}
      <GuideDemoBox title="삭제 + 확인" codeExample={DELETE_CONFIRM_CODE}>
        <div className="guide-demo-description">
          useMessage.confirm으로 삭제 확인 → API 호출 → 새로고침
        </div>
      </GuideDemoBox>

      {/* usePageHandlers 연동 */}
      <GuideDemoBox title="usePageHandlers 연동" codeExample={PAGE_HANDLERS_CODE}>
        <div className="guide-demo-description">
          MenuButtonBar와 페이지 핸들러 연결 패턴
        </div>
      </GuideDemoBox>

      {/* API 호출 패턴 */}
      <GuideDemoBox title="API 호출 패턴" codeExample={API_CALL_CODE}>
        <div className="guide-demo-description">
          axios + ApiResponse 구조 + 에러 핸들링
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default CrudPatternGuide;
