import React, { useState } from 'react';
import locale from 'antd/es/date-picker/locale/ko_KR';
import CustomInput from '@component/input/CustomInput';
import CustomTextArea from '@component/input/CustomTextArea';
import CustomInputNumber from '@component/input/CustomInputNumber';
import CustomPassword from '@component/input/CustomPassword';
import CustomDatePicker from '@component/date/CustomDatePicker';
import CustomRangePicker from '@component/date/CustomRangePicker';
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';
import CustomTimePicker from '@component/date/CustomTimePicker';
import CustomMaskedInput from '@component/input/CustomMaskedInput';
import CustomSearchBar from '@component/input/CustomSearchBar';
import CustomTimeRangePicker from '@component/date/CustomTimeRangePicker';
import UserSearchPopup from '@component/popup/search/UserSearchPopup';
import { UserSearchResult } from '@interface/auth/AuthManagement';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const TEXT_INPUT_CODE = `import CustomInput from '@component/input/CustomInput';

// ① 기본 사용 (state 연결)
const [name, setName] = useState('');
<CustomInput value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" />

// ② 필수 입력 표시 (빨간 별표) - className="required" 추가
<CustomInput value={name} onChange={(e) => setName(e.target.value)} className="required" />

// ③ 비활성화 / 읽기전용
<CustomInput value={name} disabled />   // 회색 배경, 수정 불가
<CustomInput value={name} readOnly />   // 흰 배경, 수정 불가 (복사 가능)

// ④ 정규식 검증 - 제공되는 패턴 사용
import { ALPHANUMERIC_REGEXP } from '@util/validationPatterns';

<CustomInput
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  regExp={ALPHANUMERIC_REGEXP}
  placeholder="영문과 숫자만 입력 가능합니다"
/>
// → 한글 입력 시 자동 차단 + 툴팁 에러 메시지 표시

// ⑤ 직접 정규식 지정
<CustomInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  regExp={{ value: /^\\d{0,10}$/, message: '숫자만 10자리까지 입력 가능합니다.' }}
/>

// ⑥ 글자 수 제한
<CustomInput value={value} onChange={(e) => setValue(e.target.value)} maxLength={20} />

// ⑦ ref로 포커스 제어
const inputRef = useRef<any>(null);
<CustomInput ref={inputRef} />
inputRef.current?.focus();  // 외부에서 포커스 이동

// ⑧ react-hook-form과 함께 사용 시 → CustomSaveFormInput 사용 권장
// import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
// <CustomSaveFormInput name="userName" control={control} title="사용자명" required
//   rules={{ required: '사용자명을 입력해주세요.' }} regExp={ALPHANUMERIC_REGEXP} />

// ── 사용 가능한 정규식 패턴 (validationPatterns.ts) ──
// ALPHANUMERIC_REGEXP  - 영문+숫자만
// INTEGER_REGEXP       - 정수만
// FLOAT_REGEXP         - 실수만
// EMAIL_REGEXP         - 이메일
// PHONE_REGEXP         - 전화번호
// KOREAN_REGEXP        - 한글만
// URL_REGEXP           - URL
// ZIP_REGEXP           - 우편번호 (5자리)

// ── Props 정리 ──
// regExp?: { value: RegExp; message: string } - 정규식 검증 (실패 시 입력 차단 + 툴팁)
// className="required" - 필수 입력 표시
// disabled / readOnly  - 비활성화 / 읽기전용
// maxLength            - 최대 글자 수
// 포커스 시 전체 선택, IME(한글) 조합 안전 처리 내장
// forwardRef 지원 (ref 전달 가능)`;

const TEXT_AREA_CODE = `import CustomTextArea from '@component/input/CustomTextArea';

// ① 기본 사용 (state 연결)
const [memo, setMemo] = useState('');
<CustomTextArea
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
  placeholder="메모를 입력하세요"
  rows={4}
/>

// ② 비활성화 / 읽기전용
<CustomTextArea value={memo} rows={4} disabled />
<CustomTextArea value={memo} rows={4} readOnly />

// ③ 자동 높이 조절 (내용에 따라 늘어남)
<CustomTextArea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  autoSize={{ minRows: 2, maxRows: 8 }}
/>

// ④ 글자 수 표시 + 제한
<CustomTextArea maxLength={500} showCount />

// ⑤ IME 조합 중 onChange 억제 (실시간 미리보기, 자동저장에 유용)
// → 한글 입력 중간 단계(ㄱ→가→각)에서 onChange가 호출되지 않음
<CustomTextArea
  suppressOnComposing
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

// ⑥ react-hook-form과 함께 사용 시 → CustomSaveFormTextArea 사용 권장
// import CustomSaveFormTextArea from '@component/form/CustomSaveFormTextArea';
// <CustomSaveFormTextArea name="memo" control={control} title="비고" rows={4} />

// ── Props 정리 ──
// rows?: number               - 고정 줄 수
// autoSize?: { minRows, maxRows } - 자동 높이 조절
// showCount?: boolean          - 글자 수 표시
// maxLength?: number           - 최대 글자 수
// suppressOnComposing?: boolean - IME 조합 완료 후에만 onChange (기본: false)`;

const NUMBER_INPUT_CODE = `import CustomInputNumber from '@component/input/CustomInputNumber';

// ① 기본 사용 (state 연결)
// ※ onChange는 (value: number | null) => void 형태 (e.target.value가 아님!)
const [count, setCount] = useState<number | null>(0);
<CustomInputNumber value={count} onChange={(v) => setCount(v)} />

// ② 최솟값 / 최댓값 제한
<CustomInputNumber value={count} onChange={setCount} min={0} max={100} />

// ③ 금액 입력 (천단위 콤마 표시)
<CustomInputNumber
  value={amount}
  onChange={setAmount}
  formatter={(v) => \`\${v}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}
  parser={(v) => Number(v?.replace(/,/g, '') ?? 0)}
/>

// ④ 소수점 입력 (0.1 단위 증감)
<CustomInputNumber value={rate} onChange={setRate} min={0} max={100} step={0.1} />

// ⑤ 비활성화
<CustomInputNumber value={count} disabled />

// ⑥ react-hook-form과 함께 사용 시 → CustomSaveFormInputNumber 사용 권장
// import CustomSaveFormInputNumber from '@component/form/CustomSaveFormInputNumber';
// <CustomSaveFormInputNumber name="price" control={control} title="가격" />

// ── Props 정리 ──
// selectOnFocus?: boolean - 포커스 시 전체 선택 (기본: true)
// min?: number            - 최솟값
// max?: number            - 최댓값
// step?: number           - 증감 단위
// formatter?: (value) => string  - 표시 형식 (ex: 천단위 콤마)
// parser?: (value) => number     - formatter 역변환`;

const PASSWORD_CODE = `import CustomPassword from '@component/input/CustomPassword';

// ① 기본 사용 (눈 아이콘으로 표시/숨김 전환)
const [password, setPassword] = useState('');
<CustomPassword
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="비밀번호를 입력하세요"
/>

// ② 비밀번호 정책 검증 (포커스 시 Tooltip으로 에러 표시)
// → validationPatterns.ts의 PASSWORD_REGEXP 사용도 가능
<CustomPassword
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  regExp={/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$/}
  regExpMessage="영문, 숫자, 특수문자 포함 8자 이상"
/>

// ③ 비밀번호 확인 (눈 아이콘 숨김)
<CustomPassword
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="비밀번호 확인"
  visibilityToggle={false}
/>

// ④ 비활성화
<CustomPassword value="password123" disabled />

// ⑤ react-hook-form과 함께 사용 시 → CustomSaveFormPassword 사용 권장
// import CustomSaveFormPassword from '@component/form/CustomSaveFormPassword';
// <CustomSaveFormPassword name="password" control={control} title="비밀번호" required />

// ── Props 정리 ──
// regExp?: RegExp          - 비밀번호 검증 정규식
// regExpMessage?: string   - 검증 실패 시 Tooltip 메시지 (기본: '비밀번호 형식이 올바르지 않습니다')
// visibilityToggle?: boolean - 눈 아이콘 표시/숨김 토글 (기본: true)`;

const MASKED_INPUT_CODE = `import CustomMaskedInput from '@component/input/CustomMaskedInput';

// ① 전화번호 마스킹 (자동으로 010-1234-5678 형식 적용)
// ※ onChange는 (value: string) => void 형태 (e.target.value가 아님!)
const [phone, setPhone] = useState('');
<CustomMaskedInput
  maskType="phone"
  value={phone}
  onChange={setPhone}
  placeholder="전화번호"
/>

// ② 사업자번호 마스킹 (123-45-67890 형식)
const [bizNo, setBizNo] = useState('');
<CustomMaskedInput
  maskType="bizNo"
  value={bizNo}
  onChange={setBizNo}
  placeholder="사업자번호"
/>

// ③ 커스텀 마스크 (직접 포맷 함수 지정)
<CustomMaskedInput
  maskType="custom"
  customMask={(v) => {
    const nums = v.replace(/\\D/g, '').slice(0, 16);
    return nums.replace(/(\\d{4})(?=\\d)/g, '$1-');
  }}
  value={cardNo}
  onChange={setCardNo}
  placeholder="카드번호"
/>

// ④ 비활성화
<CustomMaskedInput maskType="phone" value={phone} disabled />

// ⑤ react-hook-form과 함께 사용 시 → CustomSaveFormMaskedInput 사용 권장
// import CustomSaveFormMaskedInput from '@component/form/CustomSaveFormMaskedInput';
// <CustomSaveFormMaskedInput name="phone" control={control} title="전화번호" maskType="phone" />

// ── Props 정리 ──
// maskType: 'phone' | 'bizNo' | 'custom' - 마스크 타입 (필수)
// customMask?: (value: string) => string - maskType='custom'일 때 포맷 함수
// onChange?: (value: string) => void     - 포맷된 값이 string으로 전달됨
// ※ 일반 Input과 달리 onChange에 e.target.value가 아닌 문자열이 직접 전달됨`;

const DATE_PICKER_CODE = `import CustomDatePicker from '@component/date/CustomDatePicker';
import dayjs, { Dayjs } from 'dayjs';

// ① 기본 사용 (state 연결)
// ※ onChange는 (date: Dayjs | null) => void 형태
const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
<CustomDatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  placeholder="날짜 선택"
/>

// ② 표시 형식 지정
<CustomDatePicker format="YYYY년 MM월 DD일" />

// ③ 오늘 이전 날짜 비활성화
<CustomDatePicker
  disabledDate={(current) => current && current < dayjs().startOf('day')}
/>

// ④ 비활성화
<CustomDatePicker disabled />

// ⑤ 문자열로 값 가져오기 (서버 전송용)
<CustomDatePicker
  value={selectedDate}
  onChange={(date) => {
    setSelectedDate(date);
    const dateStr = date?.format('YYYY-MM-DD');  // '2024-03-15' 형태
    console.log(dateStr);
  }}
/>

// ⑥ react-hook-form과 함께 사용 시 → CustomSaveFormDatePicker 사용 권장
// import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
// <CustomSaveFormDatePicker name="startDate" control={control} title="시작일" />

// ── Props 정리 ──
// value?: Dayjs | null         - 선택된 날짜 (dayjs 객체)
// onChange?: (date: Dayjs | null) => void
// format?: string              - 표시 형식 (기본: 'YYYY-MM-DD')
// picker?: 'date' | 'month' | 'year' | 'quarter' | 'week'
// disabledDate?: (current: Dayjs) => boolean - 특정 날짜 비활성화
// 한국어(ko_KR) 로케일 기본 적용`;

const DATE_RANGE_PICKER_CODE = `// ※ 두 가지 방법이 있음 — 상황에 맞게 선택

// ═══════════════════════════════════
// 방법 1: CustomRangePicker (하나의 피커에서 시작~종료 선택)
// → 간단한 기간 선택에 적합
// ═══════════════════════════════════
import CustomRangePicker from '@component/date/CustomRangePicker';
import { Dayjs } from 'dayjs';

const [startDate, setStartDate] = useState<Dayjs | null>(null);
const [endDate, setEndDate] = useState<Dayjs | null>(null);

// ① 기본 사용
<CustomRangePicker
  value={[startDate, endDate]}
  onChange={(dates) => {
    setStartDate(dates?.[0] ?? null);
    setEndDate(dates?.[1] ?? null);
  }}
  placeholder={['시작일', '종료일']}
/>

// ② 월 범위 선택
<CustomRangePicker picker="month" format="YYYY년 MM월" />

// ═══════════════════════════════════
// 방법 2: CustomDateRangePicker (시작·종료 DatePicker 분리형)
// → 시작/종료에 각각 다른 조건(disabled, disabledDate)을 적용해야 할 때
// ═══════════════════════════════════
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';

// ① 기본 사용
<CustomDateRangePicker
  startValue={startDate}
  endValue={endDate}
  onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
/>

// ② 종료일은 시작일 이후만 선택 가능
<CustomDateRangePicker
  startValue={startDate}
  endValue={endDate}
  onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
  endProps={{
    disabledDate: (current) => !!startDate && current < startDate.startOf('day'),
  }}
/>

// ── Props (CustomRangePicker) ──
// Ant Design RangePicker props 그대로 사용 가능
// picker?: 'date' | 'month' | 'year'

// ── Props (CustomDateRangePicker) ──
// startValue, endValue: Dayjs | null
// onChange: (start: Dayjs | null, end: Dayjs | null) => void
// startProps, endProps: DatePickerProps - 개별 DatePicker에 추가 props 전달
// startPlaceholder, endPlaceholder: string`;

const TIME_PICKER_CODE = `import CustomTimePicker from '@component/date/CustomTimePicker';
import { Dayjs } from 'dayjs';

// ① 기본 사용 (시:분)
const [time, setTime] = useState<Dayjs | null>(null);
<CustomTimePicker
  value={time}
  onChange={(t) => setTime(t)}
  format="HH:mm"
  placeholder="시간 선택"
/>

// ② 30분 단위로 선택
<CustomTimePicker format="HH:mm" minuteStep={30} />

// ③ 오전/오후 12시간제
<CustomTimePicker use12Hours format="h:mm a" />

// ④ 특정 시간 비활성화 (09:00 이전 선택 불가)
<CustomTimePicker
  disabledTime={() => ({
    disabledHours: () => Array.from({ length: 9 }, (_, i) => i),
  })}
/>

// ⑤ 문자열로 값 가져오기
<CustomTimePicker
  value={time}
  onChange={(t) => {
    setTime(t);
    const timeStr = t?.format('HH:mm');  // '14:30' 형태
  }}
  format="HH:mm"
/>

// ── Props 정리 ──
// format?: string       - 표시 형식 (기본: 'HH:mm:ss')
// minuteStep?: number   - 분 선택 단위 (ex: 30이면 00, 30만 선택 가능)
// use12Hours?: boolean  - 12시간제 (AM/PM)
// 한국어(ko_KR) 로케일 기본 적용`;

const MONTH_PICKER_CODE = `import CustomDatePicker from '@component/date/CustomDatePicker';
import { Dayjs } from 'dayjs';

// ※ CustomDatePicker에 picker prop만 변경하면 월/연/분기 선택으로 전환됨

// ① 월 선택
const [month, setMonth] = useState<Dayjs | null>(null);
<CustomDatePicker
  picker="month"
  placeholder="월 선택"
  format="YYYY년 MM월"
  value={month}
  onChange={(date) => setMonth(date)}
/>

// ② 연도 선택
<CustomDatePicker picker="year" placeholder="연도 선택" />

// ③ 분기 선택
<CustomDatePicker picker="quarter" placeholder="분기 선택" />

// ④ 주 단위 선택
<CustomDatePicker picker="week" placeholder="주 선택" />

// ⑤ 문자열로 값 가져오기
<CustomDatePicker
  picker="month"
  value={month}
  onChange={(date) => {
    setMonth(date);
    const monthStr = date?.format('YYYY-MM');  // '2024-03' 형태
  }}
/>

// ── picker 옵션 ──
// 'date'    - 일 선택 (기본)
// 'month'   - 월 선택
// 'year'    - 연 선택
// 'quarter' - 분기 선택
// 'week'    - 주 선택`;

const SEARCH_BAR_CODE = `import CustomSearchBar from '@component/input/CustomSearchBar';

// ① 기본 사용 (300ms 디바운스 - 타이핑 멈추면 자동 검색)
// ※ onSearch는 (value: string, source?: string) => void 형태
<CustomSearchBar
  placeholder="검색어를 입력하세요"
  onSearch={(value) => fetchData(value)}
/>

// ② 디바운스 없음 (검색 버튼 클릭 시에만 검색)
<CustomSearchBar
  placeholder="사용자명 검색"
  onSearch={handleSearch}
  debounceMs={0}
/>

// ③ 넓이 지정
<CustomSearchBar style={{ width: 300 }} onSearch={handleSearch} />

// ④ 비활성화
<CustomSearchBar placeholder="비활성" disabled />

// ⑤ API 호출 예제
const handleSearch = (keyword: string) => {
  // keyword가 빈 문자열이면 전체 목록 조회
  fetchUserList({ keyword, page: 1 });
};
<CustomSearchBar placeholder="이름, 이메일 검색" onSearch={handleSearch} />

// ⑥ 사용자 조회 팝업 연동 (엔터/돋보기 클릭 시 팝업, X 클릭 시 무시)
// → source 인자로 'clear'(X버튼) / 'input'(엔터) 등 구분 가능
import UserSearchPopup from '@component/popup/search/UserSearchPopup';

const [popupOpen, setPopupOpen] = useState(false);
const [keyword, setKeyword] = useState('');
const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

<CustomSearchBar
  placeholder="사용자 검색"
  debounceMs={0}
  onSearch={(v, source) => {
    if (source === 'clear') return;  // X 버튼 클릭 시 팝업 안 열림
    setKeyword(v);
    setPopupOpen(true);
  }}
/>

<UserSearchPopup
  open={popupOpen}
  onClose={() => setPopupOpen(false)}
  initialKeyword={keyword}    // 입력한 검색어가 팝업에 자동 입력 + 조회
  onSelect={(user) => {
    setSelectedUser(user);
    setPopupOpen(false);
  }}
/>

// ── Props 정리 ──
// onSearch?: (value: string, source?: string) => void - 검색어 + 트리거 구분
//   source: 'clear' = X버튼 클릭, 'input' = 엔터, undefined = 돋보기 버튼
// debounceMs?: number - 디바운스 대기 시간 ms (기본: 300, 0이면 버튼 클릭만)
// ※ 한글 IME 조합 완료 후에만 디바운스 시작 (중간 조합에서 불필요한 API 호출 방지)

// ── UserSearchPopup Props ──
// open: boolean              - 팝업 표시 여부
// onClose: () => void        - 팝업 닫기
// onSelect: (user) => void   - 사용자 선택 콜백
// initialKeyword?: string    - 팝업 열릴 때 초기 검색어 (자동 조회)`;

const TIME_RANGE_PICKER_CODE = `import CustomTimeRangePicker from '@component/date/CustomTimeRangePicker';
import { Dayjs } from 'dayjs';

// ① 기본 사용 (시작~종료 시간 선택)
const [startTime, setStartTime] = useState<Dayjs | null>(null);
const [endTime, setEndTime] = useState<Dayjs | null>(null);

<CustomTimeRangePicker
  value={[startTime, endTime]}
  onChange={(times) => {
    setStartTime(times?.[0] ?? null);
    setEndTime(times?.[1] ?? null);
  }}
  format="HH:mm"
  placeholder={['시작 시간', '종료 시간']}
/>

// ② 30분 단위
<CustomTimeRangePicker format="HH:mm" minuteStep={30} />

// ③ 비활성화
<CustomTimeRangePicker format="HH:mm" disabled />

// ④ 문자열로 값 가져오기
<CustomTimeRangePicker
  format="HH:mm"
  onChange={(times) => {
    const startStr = times?.[0]?.format('HH:mm');  // '09:00'
    const endStr = times?.[1]?.format('HH:mm');     // '18:00'
  }}
/>

// ※ 시작·종료를 개별 관리해야 하면 CustomTimePicker 두 개를 직접 배치

// ── Props 정리 ──
// format?: string       - 표시 형식
// minuteStep?: number   - 분 선택 단위
// placeholder?: [string, string] - 시작/종료 placeholder
// Ant Design TimePicker.RangePicker props 그대로 사용 가능
// 한국어(ko_KR) 로케일 기본 적용`;

const FormInputsGuide = () => {
  const [textValue, setTextValue] = useState('텍스트 입력');
  const [textAreaValue, setTextAreaValue] = useState('여러 줄 텍스트\n입력 가능');
  const [numberValue, setNumberValue] = useState<number | null>(123456);
  const [phoneValue, setPhoneValue] = useState('01012345678');
  const [bizNoValue, setBizNoValue] = useState('1234567890');
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [userSearchKeyword, setUserSearchKeyword] = useState('');

  return (
    <GuideSection id="form-inputs" title="폼 입력 (Form Inputs)" description="텍스트, 숫자, 날짜 등 다양한 폼 입력 컴포넌트">
      {/* TextInput (CustomInput) */}
      <GuideDemoBox title="TextInput (CustomInput)" codeExample={TEXT_INPUT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomInput value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="텍스트를 입력하세요" />
          </GuideStatusItem>
          <GuideStatusItem label="required + enabled">
            <CustomInput value={textValue} onChange={(e) => setTextValue(e.target.value)} className="required" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomInput value={textValue} disabled />
          </GuideStatusItem>
          <GuideStatusItem label="readOnly">
            <CustomInput value={textValue} readOnly />
          </GuideStatusItem>
          <GuideStatusItem label="placeholder">
            <CustomInput placeholder="입력해주세요" />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          regExp 옵션으로 입력 제한 가능 (예: 숫자만, 한글만)
        </div>
      </GuideDemoBox>

      {/* TextArea */}
      <GuideDemoBox title="TextArea (다중 줄 텍스트)" codeExample={TEXT_AREA_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomTextArea rows={4} value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomTextArea rows={4} value={textAreaValue} disabled />
          </GuideStatusItem>
          <GuideStatusItem label="readOnly">
            <CustomTextArea rows={4} value={textAreaValue} readOnly />
          </GuideStatusItem>
          <GuideStatusItem label="placeholder">
            <CustomTextArea rows={4} placeholder="내용을 입력해주세요." />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* NumberInput */}
      <GuideDemoBox title="NumberInput (숫자 전용)" codeExample={NUMBER_INPUT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled (천단위 콤마)">
            <CustomInputNumber
              value={numberValue}
              onChange={(v) => setNumberValue(v)}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v?.replace(/,/g, '') ?? 0)}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomInputNumber value={numberValue} disabled formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </GuideStatusItem>
          <GuideStatusItem label="min/max 설정">
            <CustomInputNumber min={0} max={100} defaultValue={50} />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* PasswordInput */}
      <GuideDemoBox title="PasswordInput (비밀번호)" codeExample={PASSWORD_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomPassword placeholder="비밀번호를 입력하세요" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomPassword value="password123" disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* MaskedInput */}
      <GuideDemoBox title="MaskedInput (포맷 마스킹)" codeExample={MASKED_INPUT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="전화번호">
            <CustomMaskedInput maskType="phone" value={phoneValue} onChange={setPhoneValue} placeholder="전화번호" />
          </GuideStatusItem>
          <GuideStatusItem label="사업자번호">
            <CustomMaskedInput maskType="bizNo" value={bizNoValue} onChange={setBizNoValue} placeholder="사업자번호" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomMaskedInput maskType="phone" value={phoneValue} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* DatePicker */}
      <GuideDemoBox title="DatePicker (날짜 선택)" codeExample={DATE_PICKER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomDatePicker locale={locale} placeholder="날짜 선택" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomDatePicker locale={locale} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* DateRangePicker */}
      <GuideDemoBox title="DateRangePicker (기간 선택)" codeExample={DATE_RANGE_PICKER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomRangePicker locale={locale} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomRangePicker locale={locale} disabled allowEmpty />
          </GuideStatusItem>
          <GuideStatusItem label="CustomDateRangePicker">
            <CustomDateRangePicker />
          </GuideStatusItem>
          <GuideStatusItem label="CustomDateRangePicker (disabled)">
            <CustomDateRangePicker disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* TimePicker */}
      <GuideDemoBox title="TimePicker (시간 선택)" codeExample={TIME_PICKER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomTimePicker placeholder="시간 선택" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomTimePicker disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* MonthPicker */}
      <GuideDemoBox title="MonthPicker (월 선택)" codeExample={MONTH_PICKER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomDatePicker picker="month" locale={locale} placeholder="월 선택" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomDatePicker picker="month" locale={locale} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* SearchBar */}
      <GuideDemoBox title="SearchBar (디바운스 검색 입력)" codeExample={SEARCH_BAR_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="기본 (300ms 디바운스)">
            <CustomSearchBar placeholder="검색어를 입력하세요" onSearch={(v) => console.log('search:', v)} />
          </GuideStatusItem>
          <GuideStatusItem label="디바운스 없음">
            <CustomSearchBar placeholder="버튼 클릭 시 검색" debounceMs={0} onSearch={(v) => console.log('search:', v)} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomSearchBar placeholder="비활성" disabled />
          </GuideStatusItem>
        </GuideStatusRow>
        <GuideStatusRow>
          <GuideStatusItem label="사용자 조회 팝업 연동 (엔터/돋보기 클릭)">
            <CustomSearchBar
              placeholder="사용자 검색"
              debounceMs={0}
              onSearch={(v, source) => {
                if (source === 'clear') return;
                setUserSearchKeyword(v);
                setUserPopupOpen(true);
              }}
            />
            {selectedUser && (
              <div className="guide-demo-description" style={{ marginTop: 4 }}>
                선택된 사용자: {selectedUser.userName} ({selectedUser.userId})
              </div>
            )}
          </GuideStatusItem>
        </GuideStatusRow>
        <UserSearchPopup
          open={userPopupOpen}
          onClose={() => setUserPopupOpen(false)}
          initialKeyword={userSearchKeyword}
          onSelect={(user) => {
            setSelectedUser(user);
            setUserPopupOpen(false);
          }}
        />
        <div className="guide-demo-description">
          한글 IME 조합 완료 후 디바운스 시작 / debounceMs=0이면 버튼 클릭 시에만 검색
        </div>
      </GuideDemoBox>

      {/* TimeRangePicker */}
      <GuideDemoBox title="TimeRangePicker (시간 범위 선택)" codeExample={TIME_RANGE_PICKER_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomTimeRangePicker format="HH:mm" placeholder={['시작 시간', '종료 시간']} />
          </GuideStatusItem>
          <GuideStatusItem label="30분 단위">
            <CustomTimeRangePicker format="HH:mm" minuteStep={30} placeholder={['시작', '종료']} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomTimeRangePicker format="HH:mm" disabled />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          시작·종료 시간을 하나의 피커에서 선택. 개별 관리가 필요하면 CustomTimePicker 두 개를 사용
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default FormInputsGuide;
