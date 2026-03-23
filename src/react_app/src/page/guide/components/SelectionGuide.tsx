import React, { useState } from 'react';
import { Radio, Switch, TreeSelect, Select } from 'antd';
import CustomSelect from '@component/CustomSelect';
import CustomAutoComplete from '@component/CustomAutoComplete';
import CustomCheckbox from '@component/CustomCheckbox';
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

const SelectionGuide = () => {
  const [selectValue, setSelectValue] = useState('01');
  const [multiValue, setMultiValue] = useState<string[]>(['01', '02']);
  const [radioValue, setRadioValue] = useState('A');
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [treeValue, setTreeValue] = useState<string | undefined>();

  return (
    <GuideSection id="selection" title="선택 컴포넌트 (Selection)" description="드롭다운, 라디오, 체크박스 등 선택 컴포넌트">
      {/* Select / ComboBox */}
      <GuideDemoBox title="Select / ComboBox (단일 선택)">
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
      <GuideDemoBox title="MultiSelect (다중 선택)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <Select mode="multiple" value={multiValue} onChange={setMultiValue} options={selectOptions} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <Select mode="multiple" value={multiValue} disabled options={selectOptions} />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* AutoComplete */}
      <GuideDemoBox title="AutoComplete (자동완성 검색)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <CustomAutoComplete options={autoCompleteOptions} placeholder="도시명을 입력하세요" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomAutoComplete options={autoCompleteOptions} disabled value="서울특별시" />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* RadioGroup */}
      <GuideDemoBox title="RadioGroup (라디오 버튼 그룹)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <Radio.Group value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
              <Radio value="A">Yes</Radio>
              <Radio value="B">No</Radio>
            </Radio.Group>
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <Radio.Group value={radioValue} disabled>
              <Radio value="A">Yes</Radio>
              <Radio value="B">No</Radio>
            </Radio.Group>
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* CheckboxGroup */}
      <GuideDemoBox title="CheckboxGroup (체크박스 그룹)">
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

      {/* Toggle / Switch */}
      <GuideDemoBox title="Toggle / Switch (ON/OFF)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <Switch checked={switchValue} onChange={setSwitchValue} checkedChildren="ON" unCheckedChildren="OFF" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled (ON)">
            <Switch checked disabled checkedChildren="ON" unCheckedChildren="OFF" />
          </GuideStatusItem>
          <GuideStatusItem label="disabled (OFF)">
            <Switch checked={false} disabled checkedChildren="ON" unCheckedChildren="OFF" />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* TreeSelect */}
      <GuideDemoBox title="TreeSelect (트리형 선택)">
        <GuideStatusRow>
          <GuideStatusItem label="enabled">
            <TreeSelect
              treeData={treeData}
              value={treeValue}
              onChange={setTreeValue}
              placeholder="부서를 선택하세요"
              treeDefaultExpandAll
              allowClear
            />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <TreeSelect
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
