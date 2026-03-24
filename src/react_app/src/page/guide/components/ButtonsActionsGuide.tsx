import React, { useState } from 'react';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  DownloadOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import CustomDropdown, { CustomDropdownButton } from '@component/button/CustomDropdown';
import CustomFloatButton, { CustomFloatButtonGroup } from '@component/button/CustomFloatButton';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const dropdownItems: MenuProps['items'] = [
  { key: '1', label: 'Excel 다운로드' },
  { key: '2', label: 'CSV 다운로드' },
  { key: '3', label: 'PDF 다운로드' },
];

const ButtonsActionsGuide = () => {
  const [showFab, setShowFab] = useState(false);

  return (
    <GuideSection id="buttons-actions" title="버튼 / 액션 (Buttons & Actions)" description="다양한 스타일과 용도의 버튼 컴포넌트">
      {/* Button Variants */}
      <GuideDemoBox title="Button (기본 버튼 스타일)">
        <div className="guide-sub-section">
          <h5>Default (기본)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton>기본 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton disabled>기본 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Primary (강조)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton type="primary">Primary 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton type="primary" disabled>Primary 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Small (소형)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="기본">
              <CustomButton size="small">소형 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="point">
              <CustomButton size="small" className="point">포인트 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton size="small" disabled>소형 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Danger (위험)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton danger>삭제</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton danger disabled>삭제</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
      </GuideDemoBox>

      {/* ButtonGroup */}
      <GuideDemoBox title="ButtonGroup (버튼 묶음)">
        <div className="guide-demo-row">
          <CustomSpace>
            <CustomButton icon={<SearchOutlined />}>조회</CustomButton>
            <CustomButton icon={<PlusOutlined />}>추가</CustomButton>
            <CustomButton icon={<DeleteOutlined />}>삭제</CustomButton>
            <CustomButton type="primary" icon={<SaveOutlined />}>저장</CustomButton>
          </CustomSpace>
        </div>
      </GuideDemoBox>

      {/* IconButton */}
      <GuideDemoBox title="IconButton (아이콘 버튼)">
        <div className="guide-demo-row">
          <CustomButton icon={<SearchOutlined />} />
          <CustomButton icon={<PlusOutlined />} />
          <CustomButton icon={<DeleteOutlined />} />
          <CustomButton icon={<SaveOutlined />} />
          <CustomButton icon={<DownloadOutlined />} />
        </div>
      </GuideDemoBox>

      {/* DropdownButton */}
      <GuideDemoBox title="DropdownButton (드롭다운 메뉴 버튼)">
        <div className="guide-demo-row">
          <CustomDropdown menu={{ items: dropdownItems }}>
            <CustomButton>
              다운로드 <DownOutlined />
            </CustomButton>
          </CustomDropdown>
          <CustomDropdownButton menu={{ items: dropdownItems }}>
            내보내기
          </CustomDropdownButton>
        </div>
      </GuideDemoBox>

      {/* FloatingActionButton */}
      <GuideDemoBox title="FloatingActionButton (FAB)">
        <div className="guide-demo-row">
          <CustomButton onClick={() => setShowFab(!showFab)}>
            {showFab ? 'FAB 숨기기' : 'FAB 보기'}
          </CustomButton>
        </div>
        {showFab && (
          <CustomFloatButtonGroup shape="square" trigger="hover" icon={<UpOutlined />}>
            <CustomFloatButton icon={<QuestionCircleOutlined />} tooltip="도움말" />
            <CustomFloatButton icon={<PlusOutlined />} tooltip="추가" />
          </CustomFloatButtonGroup>
        )}
      </GuideDemoBox>
    </GuideSection>
  );
};

export default ButtonsActionsGuide;
