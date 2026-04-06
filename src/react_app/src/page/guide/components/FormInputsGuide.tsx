import React, { useState } from 'react';
import locale from 'antd/locale/ko_KR';
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
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const TEXT_INPUT_CODE = `import CustomInput from '@component/input/CustomInput';

// 기본 사용
<CustomInput value={value} onChange={(e) => setValue(e.target.value)} />

// 정규식 검증 (영문+숫자만 허용)
import { ALPHANUMERIC_REGEXP } from '@util/validationPatterns';

<CustomInput
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  regExp={ALPHANUMERIC_REGEXP}
  placeholder="영문과 숫자만 입력 가능합니다"
/>

// 직접 정규식 지정
<CustomInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  regExp={{ value: /^\\d{0,10}$/, message: '숫자만 10자리까지 입력 가능합니다.' }}
/>

// Props:
// regExp?: { value: RegExp; message: string } - 정규식 검증 (실패 시 입력 차단 + 툴팁)
// 포커스 시 전체 선택, IME(한글) 조합 안전 처리 내장
// forwardRef 지원 (ref 전달 가능)`;

const TEXT_AREA_CODE = `import CustomTextArea from '@component/input/CustomTextArea';

// 기본 다중 줄 입력
<CustomTextArea
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
  placeholder="메모 입력"
  rows={4}
/>

// 자동 높이 조절
<CustomTextArea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  autoSize={{ minRows: 2, maxRows: 8 }}
/>

// 글자 수 표시
<CustomTextArea maxLength={500} showCount />

// IME 조합 중 onChange 억제 (실시간 미리보기, 자동저장 등에서 사용)
<CustomTextArea
  suppressOnComposing
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

// Props:
// suppressOnComposing?: boolean - true이면 IME 조합 완료 후에만 onChange 호출 (기본: false)
// rows, autoSize, showCount, maxLength 등 Ant Design TextArea props 그대로 사용 가능`;

const NUMBER_INPUT_CODE = `import CustomInputNumber from '@component/input/CustomInputNumber';

// 기본 숫자 입력
<CustomInputNumber value={count} onChange={(v) => setCount(v)} min={0} max={999} />

// 금액 입력 (천단위 구분자)
<CustomInputNumber
  value={amount}
  onChange={setAmount}
  formatter={(v) => \`\${v}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}
  parser={(v) => v?.replace(/,/g, '') as any}
/>

// 소수점 입력
<CustomInputNumber value={rate} onChange={setRate} min={0} max={100} step={0.1} />

// Props:
// selectOnFocus?: boolean - 포커스 시 전체 선택 (기본: true)
// min, max, step, formatter, parser 등 Ant Design InputNumber props 사용 가능`;

const PASSWORD_CODE = `import CustomPassword from '@component/input/CustomPassword';

// 기본 비밀번호 입력
<CustomPassword
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="비밀번호 입력"
/>

// 비밀번호 정책 검증 (영문+숫자+특수문자 8자 이상)
<CustomPassword
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  regExp={/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$/}
  regExpMessage="영문, 숫자, 특수문자 포함 8자 이상"
/>

// Props:
// regExp?: RegExp - 비밀번호 검증 정규식
// regExpMessage?: string - 검증 실패 시 Tooltip 메시지 (기본: '비밀번호 형식이 올바르지 않습니다')
// visibilityToggle?: boolean - 눈 아이콘 표시/숨김 토글`;

const MASKED_INPUT_CODE = `import CustomMaskedInput from '@component/input/CustomMaskedInput';

// 전화번호 마스킹 (010-1234-5678)
<CustomMaskedInput
  maskType="phone"
  value={phoneValue}
  onChange={setPhoneValue}
  placeholder="전화번호"
/>

// 사업자번호 마스킹 (123-45-67890)
<CustomMaskedInput
  maskType="bizNo"
  value={bizNoValue}
  onChange={setBizNoValue}
  placeholder="사업자번호"
/>

// 커스텀 마스크 (직접 포맷 함수 지정)
<CustomMaskedInput
  maskType="custom"
  customMask={(v) => v.replace(/(\\d{4})(\\d{4})(\\d{4})(\\d{4})/, '$1-$2-$3-$4')}
  value={cardNo}
  onChange={setCardNo}
/>

// Props:
// maskType: 'phone' | 'bizNo' | 'custom' - 마스크 타입 (필수)
// customMask?: (value: string) => string - maskType='custom'일 때 포맷 함수
// onChange?: (value: string) => void - 포맷된 값 전달 (e.target.value가 아닌 string)`;

const DATE_PICKER_CODE = `import CustomDatePicker from '@component/date/CustomDatePicker';
import dayjs from 'dayjs';

// 기본 날짜 선택 (한국어 로케일 기본 적용)
<CustomDatePicker
  value={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  placeholder="날짜 선택"
/>

// 형식 지정
<CustomDatePicker format="YYYY년 MM월 DD일" />

// 오늘 이전 날짜 비활성화
<CustomDatePicker
  disabledDate={(current) => current && current < dayjs().startOf('day')}
/>

// react-hook-form과 함께 사용 시 → CustomSaveFormDatePicker / CustomValidDatePicker 사용 권장

// Props:
// Ant Design DatePicker props 그대로 사용 가능
// 한국어(ko_KR) 로케일이 기본 적용됨`;

const DATE_RANGE_PICKER_CODE = `// 방법 1: CustomRangePicker (Ant Design RangePicker 래퍼)
import CustomRangePicker from '@component/date/CustomRangePicker';

<CustomRangePicker
  value={[startDate, endDate]}
  onChange={(dates) => {
    setStartDate(dates?.[0] ?? null);
    setEndDate(dates?.[1] ?? null);
  }}
  format="YYYY-MM-DD"
  placeholder={['시작일', '종료일']}
/>

// 월 범위 선택
<CustomRangePicker picker="month" format="YYYY년 MM월" />

// ─────────────────────────────────────

// 방법 2: CustomDateRangePicker (시작·종료 분리형)
// → 시작/종료 값을 개별 상태로 관리, 각각 disabled/disabledDate 조건 적용 가능
import CustomDateRangePicker from '@component/date/CustomDateRangePicker';

<CustomDateRangePicker
  startValue={startDate}
  endValue={endDate}
  onChange={(start, end) => {
    setStartDate(start);
    setEndDate(end);
  }}
/>

// 종료일은 시작일 이후만 선택 가능
<CustomDateRangePicker
  startValue={startDate}
  endValue={endDate}
  onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
  endProps={{
    disabledDate: (current) => !!startDate && current < startDate.startOf('day'),
  }}
/>

// Props (CustomDateRangePicker):
// startValue, endValue: Dayjs | null
// onChange: (startDate, endDate) => void
// startProps, endProps: DatePickerProps - 개별 DatePicker에 추가 props 전달`;

const TIME_PICKER_CODE = `import CustomTimePicker from '@component/date/CustomTimePicker';

// 시:분 입력
<CustomTimePicker
  value={selectedTime}
  onChange={(time) => setSelectedTime(time)}
  format="HH:mm"
/>

// 30분 단위로 선택
<CustomTimePicker format="HH:mm" minuteStep={30} />

// 오전/오후 12시간제
<CustomTimePicker use12Hours format="h:mm a" />

// 특정 시간 범위 비활성화 (09:00 이전 선택 불가)
<CustomTimePicker
  disabledTime={() => ({
    disabledHours: () => Array.from({ length: 9 }, (_, i) => i),
  })}
/>

// Props:
// Ant Design TimePicker props 그대로 사용 가능
// 한국어(ko_KR) 로케일이 기본 적용됨`;

const MONTH_PICKER_CODE = `import CustomDatePicker from '@component/date/CustomDatePicker';

// 월 선택 (picker="month" 사용)
<CustomDatePicker
  picker="month"
  placeholder="월 선택"
  format="YYYY년 MM월"
  value={selectedMonth}
  onChange={(date) => setSelectedMonth(date)}
/>

// 연도 선택
<CustomDatePicker picker="year" placeholder="연도 선택" />

// 분기 선택
<CustomDatePicker picker="quarter" placeholder="분기 선택" />

// Props:
// picker: 'date' | 'month' | 'year' | 'quarter' | 'week'
// CustomDatePicker에 picker prop만 변경하면 월/연/분기 선택으로 전환됨`;

const SEARCH_BAR_CODE = `import CustomSearchBar from '@component/input/CustomSearchBar';

// 기본 (300ms 디바운스)
<CustomSearchBar
  placeholder="검색어 입력"
  onSearch={(value) => fetchData(value)}
/>

// 디바운스 없음 (버튼 클릭 시에만 검색)
<CustomSearchBar
  placeholder="사용자명 검색"
  onSearch={handleSearch}
  debounceMs={0}
/>

// 넓이 지정
<CustomSearchBar style={{ width: 300 }} onSearch={handleSearch} />

// Props:
// onSearch?: (value: string) => void - 검색어 전달 콜백
// debounceMs?: number - 디바운스 대기 시간 ms (기본: 300, 0이면 버튼 클릭 시에만)
// 한글 IME 조합 완료 후에만 디바운스 시작 (중간 조합 단계에서 불필요한 호출 방지)`;

const TIME_RANGE_PICKER_CODE = `import CustomTimeRangePicker from '@component/date/CustomTimeRangePicker';

// 기본 시간 범위 선택 (시:분)
<CustomTimeRangePicker
  value={[startTime, endTime]}
  onChange={(times) => {
    setStartTime(times?.[0] ?? null);
    setEndTime(times?.[1] ?? null);
  }}
  format="HH:mm"
/>

// placeholder 지정
<CustomTimeRangePicker
  format="HH:mm"
  placeholder={['시작 시간', '종료 시간']}
/>

// 30분 단위
<CustomTimeRangePicker format="HH:mm" minuteStep={30} />

// Props:
// Ant Design TimePicker.RangePicker props 그대로 사용 가능
// 한국어(ko_KR) 로케일 기본 적용
// 시작·종료를 개별 관리가 필요하면 CustomTimePicker 두 개를 직접 배치`;

const FormInputsGuide = () => {
  const [textValue, setTextValue] = useState('텍스트 입력');
  const [textAreaValue, setTextAreaValue] = useState('여러 줄 텍스트\n입력 가능');
  const [numberValue, setNumberValue] = useState<number | null>(123456);
  const [phoneValue, setPhoneValue] = useState('01012345678');
  const [bizNoValue, setBizNoValue] = useState('1234567890');

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
            <CustomDatePicker locale={locale} disabled allowEmpty />
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
            <CustomTimePicker disabled allowEmpty />
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
            <CustomDatePicker picker="month" locale={locale} disabled allowEmpty />
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
