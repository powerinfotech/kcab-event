import React from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
import CustomSaveFormInputNumber from '@component/form/CustomSaveFormInputNumber';
import CustomSaveFormPassword from '@component/form/CustomSaveFormPassword';
import CustomSaveFormTextArea from '@component/form/CustomSaveFormTextArea';
import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
import CustomSaveFormCheckbox from '@component/form/CustomSaveFormCheckbox';
import CustomSaveFormRadio from '@component/form/CustomSaveFormRadio';
import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
import CustomSaveFormMaskedInput from '@component/form/CustomSaveFormMaskedInput';
import CustomSaveFormAutocomplete from '@component/form/CustomSaveFormAutocomplete';
import CustomSaveFormSearchInput from '@component/form/CustomSaveFormSearchInput';
import CustomValidFormInput from '@component/form/CustomValidFormInput';
import CustomValidFormSelect from '@component/form/CustomValidFormSelect';
import CustomValidFormInputNumber from '@component/form/CustomValidFormInputNumber';
import { GuideSection, GuideDemoBox } from './GuideSection';

const deptOptions = [
  { label: '개발팀', value: 'DEV' },
  { label: '인사팀', value: 'HR' },
  { label: '기획팀', value: 'PLAN' },
  { label: '재무팀', value: 'FIN' },
];

const positionOptions = [
  { label: '사원', value: '10' },
  { label: '대리', value: '20' },
  { label: '과장', value: '30' },
  { label: '차장', value: '40' },
  { label: '부장', value: '50' },
];

const useYnOptions = [
  { label: '사용', value: 'Y' },
  { label: '미사용', value: 'N' },
];

const FormGuide = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      userId: '',
      userPw: '',
      userName: '',
      phone: '',
      email: '',
      deptCd: '',
      positionCd: '',
      useYn: 'Y',
      agreeYn: false,
      joinDate: '',
      salary: null,
      memo: '',
    },
  });

  const {
    control: validControl,
  } = useForm({
    defaultValues: {
      inlineId: '',
      inlineDept: '',
      inlineSalary: null,
    },
  });

  const onSubmit = (data: any) => {
    console.log('저장 데이터:', data);
  };

  return (
    <GuideSection id="form" title="폼 컴포넌트 (Form)" description="react-hook-form 연동 저장 폼(SaveForm) 및 인라인 유효성(ValidForm) 컴포넌트">

      {/* SaveForm 패턴 */}
      <GuideDemoBox title="SaveForm (저장 폼 — 제목 + 입력 레이아웃)">
        <div className="guide-demo-description" style={{ marginBottom: 12 }}>
          CustomSaveForm* 컴포넌트는 react-hook-form Controller를 내장하며, 제목 레이블 + 입력 필드 + 유효성 툴팁을 한 번에 렌더링합니다.
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="save-form-wrap">
            <CustomSaveFormInput
              name="userId"
              control={control}
              title="사용자 ID"
              required
              rules={{ required: '사용자 ID를 입력해주세요.' }}
              placeholder="영문/숫자 입력"
            />
            <CustomSaveFormPassword
              name="userPw"
              control={control}
              title="비밀번호"
              required
              rules={{ required: '비밀번호를 입력해주세요.' }}
              placeholder="비밀번호 입력"
            />
            <CustomSaveFormInput
              name="userName"
              control={control}
              title="사용자명"
              required
              rules={{ required: '사용자명을 입력해주세요.' }}
              placeholder="이름 입력"
            />
            <CustomSaveFormMaskedInput
              name="phone"
              control={control}
              title="전화번호"
              maskType="phone"
              placeholder="전화번호 입력"
            />
            <CustomSaveFormInput
              name="email"
              control={control}
              title="이메일"
              placeholder="이메일 입력"
            />
            <CustomSaveFormSelect
              name="deptCd"
              control={control}
              title="부서"
              required
              options={deptOptions}
              nullFlag
              rules={{ required: '부서를 선택해주세요.' }}
            />
            <CustomSaveFormRadio
              name="useYn"
              control={control}
              title="사용 여부"
              options={useYnOptions}
            />
            <CustomSaveFormDatePicker
              name="joinDate"
              control={control}
              title="입사일"
              placeholder="입사일 선택"
            />
            <CustomSaveFormInputNumber
              name="salary"
              control={control}
              title="급여"
              placeholder="급여 입력"
            />
            <CustomSaveFormCheckbox
              name="agreeYn"
              control={control}
              title="약관 동의"
            >
              이용약관에 동의합니다.
            </CustomSaveFormCheckbox>
            <CustomSaveFormTextArea
              name="memo"
              control={control}
              title="비고"
              singleRow
              rows={3}
              placeholder="비고를 입력해주세요."
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <CustomSpace>
              <CustomButton type="primary" htmlType="submit">저장</CustomButton>
              <CustomButton onClick={() => reset()}>초기화</CustomButton>
            </CustomSpace>
          </div>
        </form>
      </GuideDemoBox>

      {/* ValidForm 패턴 */}
      <GuideDemoBox title="ValidForm (인라인 유효성 — 테이블 셀 / 자유 레이아웃)">
        <div className="guide-demo-description" style={{ marginBottom: 12 }}>
          CustomValidForm* 컴포넌트는 제목 레이블 없이 입력 필드 + 유효성 툴팁만 렌더링합니다. 테이블 인라인 편집 등 자유 레이아웃에 사용합니다.
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <CustomValidFormInput
            name="inlineId"
            control={validControl}
            placeholder="사용자 ID"
            required
            rules={{ required: '필수 입력' }}
            style={{ width: 160 }}
          />
          <CustomValidFormSelect
            name="inlineDept"
            control={validControl}
            options={deptOptions}
            placeholder="부서 선택"
            style={{ width: 140 }}
          />
          <CustomValidFormInputNumber
            name="inlineSalary"
            control={validControl}
            placeholder="급여"
            style={{ width: 140 }}
          />
        </div>
      </GuideDemoBox>

    </GuideSection>
  );
};

export default FormGuide;
