import React, { useState, useRef } from 'react';
import CustomAddressInput from '@component/special/CustomAddressInput';
import CustomRichEditor from '@component/special/CustomRichEditor';
import UserSearchInput from '@component/special/UserSearchInput';
import MenuButtonBar from '@component/special/MenuButtonBar';
import EditableFormCell from '@component/special/EditableFormCell';
import CustomTable from '@component/display/CustomTable';
import CustomButton from '@component/button/CustomButton';
import CustomTag from '@component/display/CustomTag';
import { useForm } from 'react-hook-form';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';
import { MenuBtnDetail, PageButtonHandlers } from '@interface/common';
import { UserSearchResult } from '@interface/auth/AuthManagement';
import { message } from 'antd';

/* ───────── 코드 예제 상수 ───────── */

const ADDRESS_INPUT_CODE = `import CustomAddressInput from '@component/special/CustomAddressInput';

// ① 기본 사용 (우편번호 + 주소 + 상세주소)
const [zipCode, setZipCode] = useState<string>('');
const [address, setAddress] = useState<string>('');
const [addressDetail, setAddressDetail] = useState<string>('');

<CustomAddressInput
  zipCode={zipCode}
  address={address}
  addressDetail={addressDetail}
  onChange={({ zipCode: zc, address: addr }) => {
    setZipCode(zc);
    setAddress(addr);
  }}
  onChangeDetail={(e) => setAddressDetail(e.target.value)}
/>

// ② 상세주소 없이 (onChangeDetail 미전달 시 상세주소 입력란 숨김)
<CustomAddressInput
  zipCode={zipCode}
  address={address}
  onChange={({ zipCode: zc, address: addr }) => { setZipCode(zc); setAddress(addr); }}
/>

// ③ disabled
<CustomAddressInput zipCode="06235" address="서울특별시 강남구" onChange={() => {}} disabled />

// ── Props 정리 ──
// zipCode        - 우편번호
// address        - 기본 주소
// addressDetail  - 상세 주소 (optional)
// onChange       - 주소 선택 콜백 ({ zipCode, address })
// onChangeDetail - 상세주소 입력 콜백 (전달 시 상세주소 입력란 표시)
// disabled       - 비활성화
// react-daum-postcode 팝업 연동`;

const CKEDITOR_CODE = `import CustomRichEditor from '@component/special/CustomRichEditor';

// ① 편집 모드
const [content, setContent] = useState<string>('<p>초기 내용</p>');
<CustomRichEditor value={content} isEditable={true} onChange={setContent} />

// ② 읽기 전용 (배경색 회색, 편집 불가)
<CustomRichEditor value={content} isEditable={false} onChange={setContent} />

// ── Props 정리 ──
// value      - HTML 문자열
// isEditable - 편집 가능 여부 (false: 회색 배경, 편집 불가)
// onChange   - 내용 변경 콜백 (string)
// toolbar=[] 고정 (툴바 없음), 높이 200px 고정`;

const USER_SEARCH_INPUT_CODE = `import UserSearchInput from '@component/special/UserSearchInput';
import { UserSearchResult } from '@interface/auth/AuthManagement';

// ① 기본 사용
const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
<UserSearchInput
  value={selectedUser?.userName ?? ''}
  onChange={(user) => setSelectedUser(user)}
  placeholder="사용자를 검색하세요"
/>

// ② react-hook-form Controller와 연동
<Controller
  name="userId"
  control={control}
  render={({ field }) => (
    <UserSearchInput
      value={field.value}
      onChange={(user) => { field.onChange(user.userId); }}
    />
  )}
/>

// ── Props 정리 ──
// value       - 표시할 텍스트 값
// onChange    - 사용자 선택 콜백 (UserSearchResult)
// placeholder - 안내 텍스트
// 읽기 전용 Input + 검색 버튼 조합, 클릭 시 UserSearchPopup 오픈`;

const MENU_BUTTON_BAR_CODE = `import MenuButtonBar from '@component/special/MenuButtonBar';
import { MenuBtnDetail, PageButtonHandlers } from '@interface/common';

// ① 기본 사용
const menuBtnList: MenuBtnDetail[] = [
  { btnSeq: 1, btnFuncCd: 'cfmInit',   btnNm: '초기화' },
  { btnSeq: 2, btnFuncCd: 'cfmSearch', btnNm: '조회' },
  { btnSeq: 3, btnFuncCd: 'cfmAdd',    btnNm: '추가' },
  { btnSeq: 4, btnFuncCd: 'cfmSave',   btnNm: '저장' },
  { btnSeq: 5, btnFuncCd: 'cfmDelete', btnNm: '삭제' },
  { btnSeq: 6, btnFuncCd: 'cfmExcel',  btnNm: '엑셀' },
];

const handlersRef = useRef<PageButtonHandlers>({
  cfmInit:   () => { /* 초기화 */ },
  cfmSearch: () => { /* 조회 */ },
  cfmAdd:    () => { /* 추가 */ },
  cfmSave:   () => { /* 저장 */ },
  cfmDelete: () => { /* 삭제 */ },
  cfmExcel:  () => { /* 엑셀 다운로드 */ },
});

<MenuButtonBar menuBtnList={menuBtnList} handlersRef={handlersRef} />

// ── Props 정리 ──
// menuBtnList  - API에서 조회한 버튼 권한 목록 (MenuBtnDetail[])
// handlersRef  - 버튼 핸들러 ref (PageButtonHandlers)
// btnFuncCd 코드: cfmInit, cfmSearch, cfmAdd, cfmSave, cfmDelete, cfmExcel
// btnFuncCd에 따라 아이콘 자동 매핑`;

const EDITABLE_FORM_CELL_CODE = `import EditableFormCell from '@component/special/EditableFormCell';
import { useForm } from 'react-hook-form';

// ① 테이블 컬럼 render에서 사용
const { control, register, setValue } = useForm();

const columns = [
  {
    title: '이름 (편집 가능)',
    dataIndex: 'userName',
    render: (value: string, record: SampleRow) => (
      <EditableFormCell
        record={record}
        seqField="userSeq"
        fieldSuffix="userName"
        value={value}
        setValue={setValue}
        control={control}
        register={register}
        onDataChange={handleDataChange}
        requiredMessage="이름을 입력해주세요."
        maxLength={50}
      />
    ),
  },
];

// ── Props 정리 ──
// record          - 현재 행 데이터
// seqField        - PK 필드명 (fieldName 생성에 사용)
// fieldSuffix     - 필드 접미사 (fieldName = record[seqField]_fieldSuffix)
// value           - 현재 값
// setValue        - react-hook-form setValue
// control         - react-hook-form control
// register        - react-hook-form register
// onDataChange    - 데이터 변경 콜백 (record, key, value)
// requiredMessage - 필수 입력 메시지
// maxLength       - 최대 글자 수
// regExp          - 정규식 검증`;

/* ──────────────────────────────────
   MenuButtonBar 샘플 데이터
────────────────────────────────── */
const sampleMenuBtnList: MenuBtnDetail[] = [
  { btnSeq: 1, sortSeq: 1, btnFuncCd: 'cfmInit',   btnNm: '초기화' },
  { btnSeq: 2, sortSeq: 2, btnFuncCd: 'cfmSearch', btnNm: '조회' },
  { btnSeq: 3, sortSeq: 3, btnFuncCd: 'cfmAdd',    btnNm: '추가' },
  { btnSeq: 4, sortSeq: 4, btnFuncCd: 'cfmSave',   btnNm: '저장' },
  { btnSeq: 5, sortSeq: 5, btnFuncCd: 'cfmDelete', btnNm: '삭제' },
  { btnSeq: 6, sortSeq: 6, btnFuncCd: 'cfmExcel',  btnNm: '엑셀' },
];

/* ──────────────────────────────────
   EditableFormCell 샘플 데이터
────────────────────────────────── */
interface SampleRow {
  userSeq: number;
  userName: string;
  dept: string;
}

const initialRows: SampleRow[] = [
  { userSeq: 1, userName: '홍길동', dept: '개발팀' },
  { userSeq: 2, userName: '김철수', dept: '인사팀' },
  { userSeq: 3, userName: '이영희', dept: '재무팀' },
];

/* ──────────────────────────────────
   SpecialGuide Component
────────────────────────────────── */
const SpecialGuide = () => {
  const [messageApi, contextHolder] = message.useMessage();

  /* AddressInput */
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  /* RichEditor */
  const [editorContent, setEditorContent] = useState('<p>초기 내용입니다. 수정 버튼을 눌러 편집 모드로 전환하세요.</p>');
  const [isEditable, setIsEditable] = useState(false);

  /* UserSearchInput */
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  /* MenuButtonBar */
  const handlersRef = useRef<PageButtonHandlers>({
    cfmInit:   () => messageApi.info('초기화'),
    cfmSearch: () => messageApi.info('조회'),
    cfmAdd:    () => messageApi.info('추가'),
    cfmSave:   () => messageApi.success('저장'),
    cfmDelete: () => messageApi.warning('삭제'),
    cfmExcel:  () => messageApi.info('엑셀 다운로드'),
  });

  /* EditableFormCell */
  const [tableRows, setTableRows] = useState<SampleRow[]>(initialRows);
  const { control, register, setValue } = useForm();

  const handleDataChange = (record: SampleRow, key: string, val: string) => {
    setTableRows((prev) =>
      prev.map((row) =>
        row.userSeq === record.userSeq ? { ...row, [key]: val } : row
      )
    );
  };

  const editableColumns = [
    {
      title: 'No',
      dataIndex: 'userSeq',
      key: 'userSeq',
      width: '10%',
      align: 'center' as const,
    },
    {
      title: '이름 (편집 가능)',
      dataIndex: 'userName',
      key: 'userName',
      width: '45%',
      render: (value: string, record: SampleRow) => (
        <EditableFormCell
          record={record}
          seqField="userSeq"
          fieldSuffix="userName"
          value={value}
          setValue={setValue}
          control={control}
          register={register}
          onDataChange={handleDataChange}
          requiredMessage="이름을 입력해주세요."
          maxLength={50}
        />
      ),
    },
    {
      title: '부서',
      dataIndex: 'dept',
      key: 'dept',
      width: '45%',
    },
  ];

  return (
    <GuideSection
      id="special"
      title="특수 컴포넌트 (Special)"
      description="주소 검색, 리치 에디터, 사용자 검색, 인라인 편집 셀, 메뉴 버튼 바 등 복합 컴포넌트"
    >
      {contextHolder}

      {/* AddressInput */}
      <GuideDemoBox title="AddressInput (주소 검색 입력)" codeExample={ADDRESS_INPUT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="기본 (우편번호 + 주소 + 상세주소)">
            <CustomAddressInput
              zipCode={zipCode}
              address={address}
              addressDetail={addressDetail}
              onChange={({ zipCode: zc, address: addr }) => {
                setZipCode(zc);
                setAddress(addr);
              }}
              onChangeDetail={(e) => setAddressDetail(e.target.value)}
            />
          </GuideStatusItem>
        </GuideStatusRow>
        <GuideStatusRow>
          <GuideStatusItem label="상세주소 없이">
            <CustomAddressInput
              zipCode={zipCode}
              address={address}
              onChange={({ zipCode: zc, address: addr }) => {
                setZipCode(zc);
                setAddress(addr);
              }}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomAddressInput
              zipCode="06235"
              address="서울특별시 강남구 테헤란로 152"
              onChange={() => {}}
              disabled
            />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          검색 버튼 클릭 시 Daum 주소 검색 팝업 오픈 / onChangeDetail 전달 시 상세주소 입력란 자동 표시
        </div>
      </GuideDemoBox>

      {/* RichEditor */}
      <GuideDemoBox title="RichEditor (리치 텍스트 에디터)" codeExample={CKEDITOR_CODE}>
        <div style={{ marginBottom: 8 }}>
          <CustomButton
            type={isEditable ? 'primary' : 'default'}
            onClick={() => setIsEditable((v) => !v)}
          >
            {isEditable ? '읽기 전용으로 전환' : '편집 모드로 전환'}
          </CustomButton>
          <CustomTag color={isEditable ? 'blue' : 'default'} style={{ marginLeft: 8 }}>
            {isEditable ? '편집 중' : '읽기 전용'}
          </CustomTag>
        </div>
        <CustomRichEditor
          value={editorContent}
          isEditable={isEditable}
          onChange={setEditorContent}
        />
        <div className="guide-demo-description">
          isEditable=false이면 배경색 회색, 편집 불가 / toolbar=[] 고정 (툴바 없음) / 높이 200px 고정
        </div>
      </GuideDemoBox>

      {/* UserSearchInput */}
      <GuideDemoBox title="UserSearchInput (사용자 검색 입력)" codeExample={USER_SEARCH_INPUT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="기본">
            <UserSearchInput
              value={selectedUser?.userName ?? ''}
              onChange={(user) => setSelectedUser(user)}
            />
          </GuideStatusItem>
          <GuideStatusItem label="선택된 사용자">
            {selectedUser ? (
              <div style={{ fontSize: 13, color: '#555' }}>
                ID: {selectedUser.userId} / 이름: {selectedUser.userName}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#aaa' }}>선택된 사용자 없음</div>
            )}
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          읽기 전용 Input + 검색 버튼 조합 / 클릭 시 UserSearchPopup 오픈 / react-hook-form Controller와 연동 가능
        </div>
      </GuideDemoBox>

      {/* MenuButtonBar */}
      <GuideDemoBox title="MenuButtonBar (메뉴 권한 버튼 바)" codeExample={MENU_BUTTON_BAR_CODE}>
        <MenuButtonBar menuBtnList={sampleMenuBtnList} handlersRef={handlersRef} />
        <div className="guide-demo-description" style={{ marginTop: 12 }}>
          API에서 조회한 버튼 권한 목록(menuBtnList)을 기반으로 동적 렌더링 /
          btnFuncCd에 따라 아이콘 자동 매핑 (cfmInit·cfmSearch·cfmAdd·cfmSave·cfmDelete·cfmExcel)
        </div>
      </GuideDemoBox>

      {/* EditableFormCell */}
      <GuideDemoBox title="EditableFormCell (테이블 인라인 편집 셀)" codeExample={EDITABLE_FORM_CELL_CODE}>
        <CustomTable
          rowKey="userSeq"
          columns={editableColumns}
          dataSource={tableRows}
          pagination={false}
        />
        <div className="guide-demo-description">
          이름 컬럼을 직접 클릭하여 편집 / react-hook-form 연동으로 유효성 검사 지원 /
          fieldName = {'{record[seqField]}_{fieldSuffix}'} 형식으로 자동 생성
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default SpecialGuide;
