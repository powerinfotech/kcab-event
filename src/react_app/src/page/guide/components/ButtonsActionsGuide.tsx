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
import CustomFloatButton, { CustomFloatButtonGroup, CustomFloatButtonBackTop } from '@component/button/CustomFloatButton';
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
          <h5>Dashed (점선)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton type="dashed">Dashed 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton type="dashed" disabled>Dashed 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Text (텍스트)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton type="text">Text 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton type="text" disabled>Text 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Link (링크)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="enabled">
              <CustomButton type="link">Link 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton type="link" disabled>Link 버튼</CustomButton>
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
        <div className="guide-sub-section">
          <h5>Large (대형)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="기본">
              <CustomButton size="large">대형 버튼</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="primary">
              <CustomButton size="large" type="primary">대형 Primary</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="disabled">
              <CustomButton size="large" disabled>대형 버튼</CustomButton>
            </GuideStatusItem>
          </GuideStatusRow>
        </div>
        <div className="guide-sub-section">
          <h5>Loading (로딩)</h5>
          <GuideStatusRow>
            <GuideStatusItem label="기본">
              <CustomButton loading>로딩 중</CustomButton>
            </GuideStatusItem>
            <GuideStatusItem label="primary">
              <CustomButton type="primary" loading>로딩 중</CustomButton>
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
          <CustomFloatButtonGroup shape="square" trigger="hover" icon={<UpOutlined />} style={{ bottom: 80 }}>
            <CustomFloatButton icon={<QuestionCircleOutlined />} tooltip={{ title: '도움말', placement: 'left' }} />
            <CustomFloatButton icon={<PlusOutlined />} tooltip={{ title: '추가', placement: 'left' }} />
          </CustomFloatButtonGroup>
        )}
        <div className="guide-sub-section" style={{ marginTop: 16 }}>
          <h5>BackTop (맨 위로)</h5>
          <p style={{ fontSize: 13, color: '#888' }}>페이지를 일정 이상 스크롤하면 우하단에 맨 위로 이동 버튼이 나타납니다.</p>
          <CustomFloatButtonBackTop visibilityHeight={200} />
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default ButtonsActionsGuide;
