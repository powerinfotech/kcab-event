import React, { useState } from 'react';
import { Input, InputNumber, DatePicker, TimePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import CustomInput from '@component/CustomInput';
import CustomDatePicker from '@component/CustomDatePicker';
import CustomRangePicker from '@component/CustomRangePicker';
import CustomDateRangePicker from '@component/CustomDateRangePicker';
import CustomMaskedInput from '@component/CustomMaskedInput';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const { TextArea } = Input;

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
            <TextArea rows={4} value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <TextArea rows={4} value={textAreaValue} disabled />
          </GuideStatusItem>
          <GuideStatusItem label="readOnly">
            <TextArea rows={4} value={textAreaValue} readOnly />
          </GuideStatusItem>
          <GuideStatusItem label="placeholder">
            <TextArea rows={4} placeholder="내용을 입력해주세요." />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* NumberInput */}
      <GuideDemoBox title="NumberInput (숫자 전용)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled (천단위 콤마)">
            <InputNumber
              value={numberValue}
              onChange={(v) => setNumberValue(v)}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v?.replace(/,/g, '') ?? 0)}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <InputNumber value={numberValue} disabled formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </GuideStatusItem>
          <GuideStatusItem label="min/max 설정">
            <InputNumber min={0} max={100} defaultValue={50} />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* PasswordInput */}
      <GuideDemoBox title="PasswordInput (비밀번호)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <Input.Password placeholder="비밀번호를 입력하세요" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <Input.Password value="password123" disabled />
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
            <CustomDatePicker locale={locale} disabled />
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
            <CustomRangePicker locale={locale} disabled />
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
            <TimePicker locale={locale} placeholder="시간 선택" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <TimePicker locale={locale} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* MonthPicker */}
      <GuideDemoBox title="MonthPicker (월 선택)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <DatePicker picker="month" locale={locale} placeholder="월 선택" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <DatePicker picker="month" locale={locale} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default FormInputsGuide;
