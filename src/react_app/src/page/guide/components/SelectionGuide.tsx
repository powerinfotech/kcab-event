import React, { useState } from 'react';
import { Radio, Select } from 'antd';
import CustomTreeSelect from '@component/select/CustomTreeSelect';
import CustomSwitch from '@component/select/CustomSwitch';
import CustomSelect from '@component/select/CustomSelect';
import CustomMultiSelect from '@component/select/CustomMultiSelect';
import CustomAutoComplete from '@component/input/CustomAutoComplete';
import CustomRadioGroup from '@component/select/CustomRadioGroup';
import CustomCheckbox from '@component/select/CustomCheckbox';
import CustomCheckboxGroup from '@component/select/CustomCheckboxGroup';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const selectOptions = [
  { value: '01', label: '대분류' },
  { value: '02', label: '중분류' },
  { value: '03', label: '소분류' },
];

const autoCompleteOptions = [
  { value: '서울특별시' },
  { value: '부산광역시' },
  { value: '대구광역시' },
  { value: '인천광역시' },
  { value: '광주광역시' },
];

const treeData = [
  {
    title: '경영관리본부',
    value: 'dept-1',
    children: [
      { title: '인사팀', value: 'dept-1-1' },
      { title: '재무팀', value: 'dept-1-2' },
    ],
  },
  {
    title: '기술본부',
    value: 'dept-2',
    children: [
      { title: '개발팀', value: 'dept-2-1' },
      { title: '인프라팀', value: 'dept-2-2' },
      { title: 'QA팀', value: 'dept-2-3' },
    ],
  },
];

/* ───────── 코드 예제 상수 ───────── */

const SELECT_CODE = `import CustomSelect from '@component/select/CustomSelect';

// ① 기본 사용 (state 연결)
const [selectValue, setSelectValue] = useState<string>('01');
const options = [
  { value: '01', label: '대분류' },
  { value: '02', label: '중분류' },
  { value: '03', label: '소분류' },
];
<CustomSelect value={selectValue} onChange={setSelectValue} options={options} />

// ② placeholder 설정
<CustomSelect placeholder="선택하세요" options={options} />

// ③ 비활성화
<CustomSelect value={selectValue} disabled options={options} />

// ④ 기타 Ant Design SelectProps 모두 사용 가능
<CustomSelect value={selectValue} onChange={setSelectValue} options={options} allowClear showSearch />

// ⑤ react-hook-form과 함께 사용 시 → CustomSaveFormSelect 사용 권장
// import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
// <CustomSaveFormSelect name="category" control={control} title="분류"
//   required rules={{ required: '분류를 선택해주세요.' }}
//   options={options} />

// ── Props 정리 ──
// options: { value: string; label: string }[] - 선택 옵션 목록
// value?: string - 선택된 값
// onChange?: (value: string) => void - 변경 핸들러
// placeholder?: string - 미선택 시 안내 문구
// disabled?: boolean - 비활성화
// Ant Design SelectProps 확장`;

const MULTI_SELECT_CODE = `import CustomMultiSelect from '@component/select/CustomMultiSelect';

// ① 기본 사용 (state 연결)
const [multiValue, setMultiValue] = useState<string[]>(['01', '02']);
const options = [
  { value: '01', label: '대분류' },
  { value: '02', label: '중분류' },
  { value: '03', label: '소분류' },
];
<CustomMultiSelect value={multiValue} onChange={setMultiValue} options={options} />

// ② 비활성화
<CustomMultiSelect value={multiValue} disabled options={options} />

// ③ 내부적으로 mode="multiple", showSearch=true 고정
// 검색 기능이 기본 포함되어 있어 옵션이 많을 때 유용

// ④ react-hook-form과 함께 사용 시 → CustomSaveFormSelect에 mode 전달
// import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
// <CustomSaveFormSelect name="categories" control={control} title="분류"
//   mode="multiple" options={options} />

// ── Props 정리 ──
// options: { value: string; label: string }[] - 선택 옵션 목록
// value?: string[] - 선택된 값 배열
// onChange?: (value: string[]) => void - 변경 핸들러
// disabled?: boolean - 비활성화
// mode="multiple" 고정, showSearch=true 고정
// Ant Design SelectProps 확장`;

const AUTO_COMPLETE_CODE = `import CustomAutoComplete from '@component/input/CustomAutoComplete';

// ① 기본 사용 (옵션 목록 + 필터링)
const options = [
  { value: '서울특별시' },
  { value: '부산광역시' },
  { value: '대구광역시' },
];
<CustomAutoComplete
  options={options}
  placeholder="도시명을 입력하세요"
  filterOption={(inputValue, option) =>
    (option?.value as string).includes(inputValue)
  }
/>

// ② 비활성화
<CustomAutoComplete options={options} disabled value="서울특별시" />

// ③ 서버 검색 연동 (onSearch 사용)
const [searchOptions, setSearchOptions] = useState([]);
const handleSearch = async (value: string) => {
  const result = await fetchApi(value);
  setSearchOptions(result.map(item => ({ value: item.name })));
};
<CustomAutoComplete
  options={searchOptions}
  onSearch={handleSearch}
  placeholder="검색어를 입력하세요"
/>

// ── Props 정리 ──
// options: { value: string }[] - 자동완성 후보 목록
// value?: string - 입력/선택된 값
// onChange?: (value: string) => void - 변경 핸들러
// onSearch?: (value: string) => void - 검색어 변경 시 호출
// filterOption?: (input, option) => boolean - 클라이언트 필터링
// disabled?: boolean - 비활성화
// Ant Design AutoCompleteProps 확장`;

const RADIO_GROUP_CODE = `import CustomRadioGroup from '@component/select/CustomRadioGroup';

// ① 기본 사용 (state 연결)
const [radioValue, setRadioValue] = useState<string>('A');
<CustomRadioGroup
  value={radioValue}
  onChange={(e) => setRadioValue(e.target.value)}
  options={[
    { value: 'A', label: 'Yes' },
    { value: 'B', label: 'No' },
  ]}
/>

// ② 비활성화
<CustomRadioGroup
  value={radioValue}
  disabled
  options={[
    { value: 'A', label: 'Yes' },
    { value: 'B', label: 'No' },
  ]}
/>

// ③ react-hook-form과 함께 사용 시 → CustomSaveFormRadio 사용 권장
// import CustomSaveFormRadio from '@component/form/CustomSaveFormRadio';
// <CustomSaveFormRadio name="useYn" control={control} title="사용여부"
//   required rules={{ required: '사용여부를 선택해주세요.' }}
//   options={[{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }]} />

// ── Props 정리 ──
// options: { value: string; label: string }[] - 라디오 옵션 목록
// value?: string - 선택된 값
// onChange?: (e: RadioChangeEvent) => void - 변경 핸들러
// disabled?: boolean - 전체 비활성화`;

const CHECKBOX_CODE = `import CustomCheckbox from '@component/select/CustomCheckbox';

// ① 기본 사용 (state 연결)
const [checked, setChecked] = useState<boolean>(true);
<CustomCheckbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
  KB
</CustomCheckbox>

// ② 여러 개 독립적으로 사용
const [checkA, setCheckA] = useState(true);
const [checkB, setCheckB] = useState(false);
<CustomCheckbox checked={checkA} onChange={(e) => setCheckA(e.target.checked)}>KB</CustomCheckbox>
<CustomCheckbox checked={checkB} onChange={(e) => setCheckB(e.target.checked)}>BOS</CustomCheckbox>

// ③ 비활성화
<CustomCheckbox checked={checkA} disabled>KB</CustomCheckbox>

// ④ react-hook-form과 함께 사용 시 → CustomSaveFormCheckbox 사용 권장
// import CustomSaveFormCheckbox from '@component/form/CustomSaveFormCheckbox';
// <CustomSaveFormCheckbox name="agreeYn" control={control} title="동의여부" />

// ── Props 정리 ──
// checked?: boolean - 체크 상태
// onChange?: (e: CheckboxChangeEvent) => void - 변경 핸들러
// children?: ReactNode - 레이블 텍스트
// disabled?: boolean - 비활성화
// Ant Design CheckboxProps 확장`;

const CHECKBOX_GROUP_CODE = `import CustomCheckboxGroup from '@component/select/CustomCheckboxGroup';

// ① 기본 사용 (state 연결)
const [checkGroupValue, setCheckGroupValue] = useState<string[]>(['READ']);
<CustomCheckboxGroup
  options={[
    { value: 'READ', label: '조회' },
    { value: 'WRITE', label: '등록/수정' },
    { value: 'DELETE', label: '삭제' },
  ]}
  value={checkGroupValue}
  onChange={(vals) => setCheckGroupValue(vals as string[])}
/>

// ② 개별 옵션 비활성화 (disabled 속성)
<CustomCheckboxGroup
  options={[
    { value: 'READ', label: '조회' },
    { value: 'WRITE', label: '등록/수정', disabled: true },
    { value: 'DELETE', label: '삭제', disabled: true },
  ]}
  value={checkGroupValue}
  onChange={(vals) => setCheckGroupValue(vals as string[])}
/>

// ③ 전체 비활성화
<CustomCheckboxGroup
  options={[...]}
  value={['READ', 'WRITE']}
  disabled
/>

// ── Props 정리 ──
// options: { value: string; label: string; disabled?: boolean }[] - 체크박스 옵션 목록
// value?: string[] - 선택된 값 배열
// onChange?: (values: CheckboxValueType[]) => void - 변경 핸들러
// disabled?: boolean - 전체 비활성화
// 단일 체크박스는 CustomCheckbox, 다중 선택 그룹은 CustomCheckboxGroup 사용`;

const SWITCH_CODE = `import CustomSwitch from '@component/select/CustomSwitch';

// ① 기본 사용 (state 연결)
const [switchValue, setSwitchValue] = useState<boolean>(true);
<CustomSwitch checked={switchValue} onChange={setSwitchValue} />

// ② 비활성화
<CustomSwitch checked disabled />     // ON 상태 고정
<CustomSwitch checked={false} disabled />  // OFF 상태 고정

// ③ 기본값: checkedChildren="ON", unCheckedChildren="OFF"
// 필요 시 커스텀 가능
<CustomSwitch
  checked={switchValue}
  onChange={setSwitchValue}
  checkedChildren="활성"
  unCheckedChildren="비활성"
/>

// ── Props 정리 ──
// checked?: boolean - ON/OFF 상태
// onChange?: (checked: boolean) => void - 변경 핸들러
// checkedChildren?: ReactNode - ON 상태 텍스트 (기본 "ON")
// unCheckedChildren?: ReactNode - OFF 상태 텍스트 (기본 "OFF")
// disabled?: boolean - 비활성화
// Ant Design SwitchProps 확장`;

const TREE_SELECT_CODE = `import CustomTreeSelect from '@component/select/CustomTreeSelect';

// ① 기본 사용 (트리 데이터 + state 연결)
const [treeValue, setTreeValue] = useState<string | undefined>();
const treeData = [
  {
    title: '경영관리본부',
    value: 'dept-1',
    children: [
      { title: '인사팀', value: 'dept-1-1' },
      { title: '재무팀', value: 'dept-1-2' },
    ],
  },
  {
    title: '기술본부',
    value: 'dept-2',
    children: [
      { title: '개발팀', value: 'dept-2-1' },
      { title: '인프라팀', value: 'dept-2-2' },
    ],
  },
];
<CustomTreeSelect
  treeData={treeData}
  value={treeValue}
  onChange={setTreeValue}
  placeholder="부서를 선택하세요"
/>

// ② 비활성화
<CustomTreeSelect treeData={treeData} value="dept-1-1" disabled />

// ③ 기본값: treeDefaultExpandAll=true, allowClear=true
// 트리가 자동 전체 펼침, 선택 해제 버튼 표시

// ── Props 정리 ──
// treeData: TreeNode[] - 트리 구조 데이터
// value?: string - 선택된 값
// onChange?: (value: string) => void - 변경 핸들러
// placeholder?: string - 미선택 시 안내 문구
// disabled?: boolean - 비활성화
// treeDefaultExpandAll: boolean (기본 true) - 트리 전체 펼침
// allowClear: boolean (기본 true) - 선택 해제 버튼
// Ant Design TreeSelectProps 확장`;

const SelectionGuide = () => {
  const [selectValue, setSelectValue] = useState('01');
  const [multiValue, setMultiValue] = useState<string[]>(['01', '02']);
  const [radioValue, setRadioValue] = useState('A');
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [treeValue, setTreeValue] = useState<string | undefined>();
  const [checkGroupValue, setCheckGroupValue] = useState<string[]>(['READ']);

  return (
    <GuideSection id="selection" title="선택 컴포넌트 (Selection)" description="드롭다운, 라디오, 체크박스 등 선택 컴포넌트">
      {/* Select / ComboBox */}
      <GuideDemoBox title="Select / ComboBox (단일 선택)" codeExample={SELECT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomSelect value={selectValue} onChange={setSelectValue} options={selectOptions} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomSelect value={selectValue} disabled options={selectOptions} />
          </GuideStatusItem>
          <GuideStatusItem label="placeholder">
            <CustomSelect placeholder="선택하세요" options={selectOptions} />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* MultiSelect */}
      <GuideDemoBox title="MultiSelect (다중 선택)" codeExample={MULTI_SELECT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomMultiSelect value={multiValue} onChange={setMultiValue} options={selectOptions} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomMultiSelect value={multiValue} disabled options={selectOptions} />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* AutoComplete */}
      <GuideDemoBox title="AutoComplete (자동완성 검색)" codeExample={AUTO_COMPLETE_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomAutoComplete
              options={autoCompleteOptions}
              placeholder="도시명을 입력하세요"
              filterOption={(inputValue, option) =>
                (option?.value as string).includes(inputValue)
              }
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomAutoComplete options={autoCompleteOptions} disabled value="서울특별시" />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* RadioGroup */}
      <GuideDemoBox title="RadioGroup (라디오 버튼 그룹)" codeExample={RADIO_GROUP_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomRadioGroup
              value={radioValue}
              onChange={(e) => setRadioValue(e.target.value)}
              options={[
                { value: 'A', label: 'Yes' },
                { value: 'B', label: 'No' },
              ]}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomRadioGroup
              value={radioValue}
              disabled
              options={[
                { value: 'A', label: 'Yes' },
                { value: 'B', label: 'No' },
              ]}
            />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* Checkbox (단일) */}
      <GuideDemoBox title="Checkbox (단일 체크박스)" codeExample={CHECKBOX_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <div className="guide-demo-inline">
              <CustomCheckbox checked={checkA} onChange={(e) => setCheckA(e.target.checked)}>KB</CustomCheckbox>
              <CustomCheckbox checked={checkB} onChange={(e) => setCheckB(e.target.checked)}>BOS</CustomCheckbox>
            </div>
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <div className="guide-demo-inline">
              <CustomCheckbox checked={checkA} disabled>KB</CustomCheckbox>
              <CustomCheckbox checked={checkB} disabled>BOS</CustomCheckbox>
            </div>
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* CheckboxGroup (그룹) */}
      <GuideDemoBox title="CheckboxGroup (체크박스 그룹)" codeExample={CHECKBOX_GROUP_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomCheckboxGroup
              options={[
                { value: 'READ', label: '조회' },
                { value: 'WRITE', label: '등록/수정' },
                { value: 'DELETE', label: '삭제' },
              ]}
              value={checkGroupValue}
              onChange={(vals) => setCheckGroupValue(vals as string[])}
            />
          </GuideStatusItem>
          <GuideStatusItem label="일부 비활성">
            <CustomCheckboxGroup
              options={[
                { value: 'READ', label: '조회' },
                { value: 'WRITE', label: '등록/수정', disabled: true },
                { value: 'DELETE', label: '삭제', disabled: true },
              ]}
              value={checkGroupValue}
              onChange={(vals) => setCheckGroupValue(vals as string[])}
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomCheckboxGroup
              options={[
                { value: 'READ', label: '조회' },
                { value: 'WRITE', label: '등록/수정' },
                { value: 'DELETE', label: '삭제' },
              ]}
              value={['READ', 'WRITE']}
              disabled
            />
          </GuideStatusItem>
        </GuideStatusRow>
        <div className="guide-demo-description">
          단일 체크박스는 CustomCheckbox, 다중 선택 그룹은 CustomCheckboxGroup 사용
        </div>
      </GuideDemoBox>

      {/* Toggle / Switch */}
      <GuideDemoBox title="Toggle / Switch (ON/OFF)" codeExample={SWITCH_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomSwitch checked={switchValue} onChange={setSwitchValue} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled (ON)">
            <CustomSwitch checked disabled />
          </GuideStatusItem>
          <GuideStatusItem label="disabled (OFF)">
            <CustomSwitch checked={false} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* TreeSelect */}
      <GuideDemoBox title="TreeSelect (트리형 선택)" codeExample={TREE_SELECT_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomTreeSelect
              treeData={treeData}
              value={treeValue}
              onChange={setTreeValue}
              placeholder="부서를 선택하세요"
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomTreeSelect
              treeData={treeData}
              value="dept-1-1"
              disabled
            />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default SelectionGuide;
