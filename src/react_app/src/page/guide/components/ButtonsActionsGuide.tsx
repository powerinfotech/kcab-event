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

/* ───────── 코드 예제 상수 ───────── */

const BUTTON_CODE = `import CustomButton from '@component/button/CustomButton';

// ① 기본 버튼
<CustomButton>기본 버튼</CustomButton>

// ② Primary (강조) 버튼
<CustomButton type="primary">Primary 버튼</CustomButton>

// ③ 다양한 타입 - dashed / text / link
<CustomButton type="dashed">Dashed 버튼</CustomButton>
<CustomButton type="text">Text 버튼</CustomButton>
<CustomButton type="link">Link 버튼</CustomButton>

// ④ Danger (위험/삭제) 버튼
<CustomButton danger>삭제</CustomButton>

// ⑤ 크기 변경 - size
<CustomButton size="small">소형 버튼</CustomButton>
<CustomButton size="large">대형 버튼</CustomButton>

// ⑥ 비활성화
<CustomButton disabled>비활성 버튼</CustomButton>

// ⑦ 로딩 상태
const [loading, setLoading] = useState<boolean>(false);
<CustomButton loading={loading} onClick={() => setLoading(true)}>로딩 중</CustomButton>

// ⑧ 클릭 이벤트 핸들러
<CustomButton onClick={() => console.log('clicked')}>클릭</CustomButton>

// ── Props 정리 ──
// type?: 'primary' | 'default' | 'dashed' | 'text' | 'link' - 버튼 스타일
// danger?: boolean   - 위험(삭제) 스타일 적용
// onClick?: ()=>void - 클릭 이벤트 핸들러
// loading?: boolean  - 로딩 스피너 표시
// disabled?: boolean - 비활성화
// icon?: ReactNode   - 아이콘 삽입
// size?: 'small' | 'middle' | 'large' - 버튼 크기
// className="point"  - 소형 버튼 포인트 스타일 (size="small"과 함께 사용)`;

const BUTTON_GROUP_CODE = `import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';

// ① 기본 버튼 그룹 - CustomSpace로 감싸기
<CustomSpace>
  <CustomButton>조회</CustomButton>
  <CustomButton>추가</CustomButton>
  <CustomButton>삭제</CustomButton>
  <CustomButton type="primary">저장</CustomButton>
</CustomSpace>

// ② 아이콘과 함께 사용
import { SearchOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

<CustomSpace>
  <CustomButton icon={<SearchOutlined />}>조회</CustomButton>
  <CustomButton icon={<PlusOutlined />}>추가</CustomButton>
  <CustomButton icon={<DeleteOutlined />}>삭제</CustomButton>
  <CustomButton type="primary" icon={<SaveOutlined />}>저장</CustomButton>
</CustomSpace>

// ── Props 정리 (CustomSpace) ──
// Ant Design SpaceProps 확장
// 버튼 사이 일정 간격 자동 적용
// 수평 정렬 기본, direction="vertical"로 수직 정렬 가능`;

const ICON_BUTTON_CODE = `import CustomButton from '@component/button/CustomButton';
import { SearchOutlined, PlusOutlined, DeleteOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';

// ① 아이콘만 있는 버튼 (텍스트 없음)
<CustomButton icon={<SearchOutlined />} />
<CustomButton icon={<PlusOutlined />} />
<CustomButton icon={<DeleteOutlined />} />

// ② 타입 지정과 함께 사용
<CustomButton type="primary" icon={<SaveOutlined />} />
<CustomButton type="text" icon={<DownloadOutlined />} />

// ③ 비활성화 아이콘 버튼
<CustomButton icon={<DeleteOutlined />} disabled />

// ── Props 정리 ──
// icon?: ReactNode - 아이콘 컴포넌트 전달
// children 없이 icon만 전달하면 정사각형 아이콘 버튼 생성
// type / danger / disabled 등 일반 버튼 props 동일 사용 가능`;

const DROPDOWN_BUTTON_CODE = `import CustomDropdown, { CustomDropdownButton } from '@component/button/CustomDropdown';
import CustomButton from '@component/button/CustomButton';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// ① 메뉴 아이템 정의
const items: MenuProps['items'] = [
  { key: '1', label: 'Excel 다운로드' },
  { key: '2', label: 'CSV 다운로드' },
  { key: '3', label: 'PDF 다운로드' },
];

// ② CustomDropdown - 커스텀 트리거 버튼 사용
<CustomDropdown menu={{ items }}>
  <CustomButton>
    다운로드 <DownOutlined />
  </CustomButton>
</CustomDropdown>

// ③ CustomDropdownButton - 분할 버튼 (좌: 클릭, 우: 드롭다운)
const [loading, setLoading] = useState<boolean>(false);
<CustomDropdownButton
  menu={{ items }}
  type="primary"
  onClick={() => console.log('기본 동작')}
>
  내보내기
</CustomDropdownButton>

// ── Props 정리 (CustomDropdownButton) ──
// menu: { items: MenuProps['items'] } - 드롭다운 메뉴 아이템
// type?: 'primary' | 'default' | 'dashed' | 'text' | 'link' - 버튼 스타일
// onClick?: ()=>void - 좌측 버튼 클릭 이벤트
// children: ReactNode - 버튼 텍스트`;

const FLOAT_BUTTON_CODE = `import CustomFloatButton, { CustomFloatButtonGroup, CustomFloatButtonBackTop } from '@component/button/CustomFloatButton';
import { QuestionCircleOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';

// ① 단일 FloatButton
<CustomFloatButton icon={<QuestionCircleOutlined />} tooltip={{ title: '도움말', placement: 'left' }} />

// ② FloatButtonGroup - 여러 FAB 묶음 (hover 시 펼침)
const [showFab, setShowFab] = useState<boolean>(false);
<CustomFloatButtonGroup shape="square" trigger="hover" icon={<UpOutlined />} style={{ bottom: 80 }}>
  <CustomFloatButton icon={<QuestionCircleOutlined />} tooltip={{ title: '도움말', placement: 'left' }} />
  <CustomFloatButton icon={<PlusOutlined />} tooltip={{ title: '추가', placement: 'left' }} />
</CustomFloatButtonGroup>

// ③ BackTop - 맨 위로 이동 버튼
<CustomFloatButtonBackTop visibilityHeight={200} />
// → 페이지를 200px 이상 스크롤하면 우하단에 맨 위로 이동 버튼 표시

// ── Props 정리 ──
// CustomFloatButton: icon, tooltip, onClick 등
// CustomFloatButtonGroup: shape ('circle'|'square'), trigger ('hover'|'click'), icon
// CustomFloatButtonBackTop: visibilityHeight - 버튼 표시 스크롤 높이 임계값`;

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
      <GuideDemoBox title="Button (기본 버튼 스타일)" codeExample={BUTTON_CODE}>
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
      <GuideDemoBox title="ButtonGroup (버튼 묶음)" codeExample={BUTTON_GROUP_CODE}>
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
      <GuideDemoBox title="IconButton (아이콘 버튼)" codeExample={ICON_BUTTON_CODE}>
        <div className="guide-demo-row">
          <CustomButton icon={<SearchOutlined />} />
          <CustomButton icon={<PlusOutlined />} />
          <CustomButton icon={<DeleteOutlined />} />
          <CustomButton icon={<SaveOutlined />} />
          <CustomButton icon={<DownloadOutlined />} />
        </div>
      </GuideDemoBox>

      {/* DropdownButton */}
      <GuideDemoBox title="DropdownButton (드롭다운 메뉴 버튼)" codeExample={DROPDOWN_BUTTON_CODE}>
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
      <GuideDemoBox title="FloatingActionButton (FAB)" codeExample={FLOAT_BUTTON_CODE}>
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
