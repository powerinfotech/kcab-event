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

const FormInputsGuide = () => {
  const [textValue, setTextValue] = useState('텍스트 입력');
  const [textAreaValue, setTextAreaValue] = useState('여러 줄 텍스트\n입력 가능');
  const [numberValue, setNumberValue] = useState<number | null>(123456);
  const [phoneValue, setPhoneValue] = useState('01012345678');
  const [bizNoValue, setBizNoValue] = useState('1234567890');

  return (
    <GuideSection id="form-inputs" title="폼 입력 (Form Inputs)" description="텍스트, 숫자, 날짜 등 다양한 폼 입력 컴포넌트">
      {/* TextInput (CustomInput) */}
      <GuideDemoBox title="TextInput (CustomInput)">
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
      <GuideDemoBox title="TextArea (다중 줄 텍스트)">
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
      <GuideDemoBox title="NumberInput (숫자 전용)">
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
      <GuideDemoBox title="PasswordInput (비밀번호)">
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
      <GuideDemoBox title="MaskedInput (포맷 마스킹)">
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
      <GuideDemoBox title="DatePicker (날짜 선택)">
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
      <GuideDemoBox title="DateRangePicker (기간 선택)">
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
      <GuideDemoBox title="TimePicker (시간 선택)">
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
      <GuideDemoBox title="MonthPicker (월 선택)">
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
      <GuideDemoBox title="SearchBar (디바운스 검색 입력)">
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
      <GuideDemoBox title="TimeRangePicker (시간 범위 선택)">
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
