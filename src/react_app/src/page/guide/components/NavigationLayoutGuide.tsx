import React, { useState } from 'react';
import CustomBreadcrumb from '@component/navigation/CustomBreadcrumb';
import CustomTabs from '@component/navigation/CustomTabs';
import CustomSteps from '@component/navigation/CustomSteps';
import CustomPagination from '@component/navigation/CustomPagination';
import CustomMenu from '@component/navigation/CustomMenu';
import CustomPageHeader from '@component/layout/CustomPageHeader';
import CustomButton from '@component/button/CustomButton';
import CustomSpace from '@component/button/CustomSpace';
import type { MenuProps } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined, TeamOutlined, FileTextOutlined, AppstoreOutlined } from '@ant-design/icons';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const BREADCRUMB_CODE = `import CustomBreadcrumb from '@component/navigation/CustomBreadcrumb';
import { HomeOutlined } from '@ant-design/icons';

// ① 기본 사용 — items 배열로 경로 표시
<CustomBreadcrumb
  items={[
    { title: <><HomeOutlined /> 홈</> },
    { title: '시스템관리' },
    { title: '사용자관리' },
  ]}
/>

// ② 링크 포함 (href)
<CustomBreadcrumb
  items={[
    { title: '홈', href: '/' },
    { title: '시스템관리', href: '/system' },
    { title: '사용자관리' },
  ]}
/>

// ③ 드롭다운 메뉴 포함
<CustomBreadcrumb
  items={[
    { title: '홈' },
    {
      title: '시스템관리',
      menu: { items: [
        { key: '1', label: '사용자관리' },
        { key: '2', label: '코드관리' },
      ]},
    },
  ]}
/>

// ── Props 정리 (BreadcrumbProps 확장) ──
// items: Array<{ title: ReactNode; href?: string; menu?: MenuProps }> — 경로 항목 배열
// separator?: ReactNode — 구분자 (기본 '/')`;

const TABS_CODE = `import CustomTabs from '@component/navigation/CustomTabs';

// ① 기본 사용 (비제어)
<CustomTabs
  defaultActiveKey="1"
  items={[
    { key: '1', label: '탭 메뉴 01', children: '탭 메뉴 01 내용' },
    { key: '2', label: '탭 메뉴 02', children: '탭 메뉴 02 내용' },
    { key: '3', label: '탭 메뉴 03', children: '탭 메뉴 03 내용' },
  ]}
/>

// ② 제어 모드 (state 연결)
const [activeKey, setActiveKey] = useState<string>('1');
<CustomTabs
  activeKey={activeKey}
  onChange={(key: string) => setActiveKey(key)}
  items={[
    { key: '1', label: '탭 01', children: '내용 01' },
    { key: '2', label: '탭 02', children: '내용 02' },
  ]}
/>

// ③ 카드형 탭
<CustomTabs
  type="card"
  items={[
    { key: '1', label: '탭 01', children: '내용 01' },
    { key: '2', label: '탭 02', children: '내용 02' },
  ]}
/>

// ④ 아이콘 + 비활성화 탭
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
<CustomTabs
  items={[
    { key: '1', label: '사용자', icon: <UserOutlined />, children: '사용자 탭' },
    { key: '2', label: '설정', icon: <SettingOutlined />, disabled: true },
  ]}
/>

// ⑤ 탭 오른쪽 추가 콘텐츠
<CustomTabs
  tabBarExtraContent={<Button>추가 버튼</Button>}
  items={[...]}
/>

// ── Props 정리 (TabsProps 확장) ──
// activeKey?: string — 현재 활성 탭 (제어 모드)
// onChange?: (key: string) => void — 탭 변경 콜백
// items: Array<{ key: string; label: ReactNode; children?: ReactNode; icon?: ReactNode; disabled?: boolean }>
// type?: 'line' | 'card' | 'editable-card' — 탭 스타일
// tabBarExtraContent?: ReactNode — 탭 바 오른쪽 추가 콘텐츠`;

const STEPS_CODE = `import CustomSteps from '@component/navigation/CustomSteps';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

// ① 기본 사용 (state 연결)
const [current, setCurrent] = useState<number>(0);
<CustomSteps
  current={current}
  onChange={(step: number) => setCurrent(step)}
  items={[
    { title: '기본정보', description: '필수 정보 입력' },
    { title: '상세설정', description: '추가 정보 입력' },
    { title: '검토', description: '입력 내용 확인' },
    { title: '완료', description: '등록 완료' },
  ]}
/>

// ② 아이콘 포함
<CustomSteps
  current={current}
  items={[
    { title: '기본정보', icon: <UserOutlined /> },
    { title: '상세설정', icon: <SettingOutlined /> },
    { title: '완료' },
  ]}
/>

// ③ 상태 지정 (error / finish / wait / process)
<CustomSteps
  current={1}
  status="error"
  items={[
    { title: '입력', status: 'finish' },
    { title: '검증', status: 'error' },
    { title: '완료' },
  ]}
/>

// ④ 세로 방향
<CustomSteps
  direction="vertical"
  current={current}
  items={[...]}
/>

// ⑤ 비활성화 단계
<CustomSteps
  current={0}
  items={[
    { title: '1단계' },
    { title: '2단계', disabled: true },
  ]}
/>

// ── Props 정리 (StepsProps 확장) ──
// current?: number — 현재 단계 (0부터 시작)
// status?: 'wait' | 'process' | 'finish' | 'error' — 현재 단계 상태
// direction?: 'horizontal' | 'vertical' — 방향 (기본 horizontal)
// items: Array<{ title: ReactNode; description?: ReactNode; status?: string; disabled?: boolean; icon?: ReactNode }>
// onChange?: (current: number) => void — 단계 클릭 콜백`;

const PAGINATION_CODE = `import CustomPagination from '@component/navigation/CustomPagination';

// ① 기본 사용 (state 연결)
const [current, setCurrent] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(10);
<CustomPagination
  current={current}
  pageSize={pageSize}
  total={100}
  onChange={(page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  }}
/>

// ② 페이지 사이즈 변경 셀렉터 표시
<CustomPagination
  current={current}
  pageSize={pageSize}
  total={100}
  onChange={(page, size) => { setCurrent(page); setPageSize(size); }}
  showSizeChanger
/>

// ③ 총 건수 표시
<CustomPagination
  current={current}
  total={100}
  showTotal={(total, range) => \`\${range[0]}-\${range[1]} / 총 \${total}건\`}
/>

// ④ 간소화 모드
<CustomPagination simple defaultCurrent={1} total={50} />

// ⑤ 비활성화
<CustomPagination defaultCurrent={1} total={50} disabled />

// ── Props 정리 (PaginationProps 확장) ──
// current?: number — 현재 페이지
// pageSize?: number — 페이지당 항목 수
// total: number — 전체 항목 수
// onChange?: (page: number, pageSize: number) => void — 페이지 변경 콜백
// showSizeChanger?: boolean — 페이지 사이즈 셀렉터 표시
// showTotal?: (total: number, range: [number, number]) => ReactNode — 총 건수 표시`;

const MENU_CODE = `import CustomMenu from '@component/navigation/CustomMenu';
import { AppstoreOutlined, TeamOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';

// ① 인라인 메뉴 (사이드바)
const [selectedKey, setSelectedKey] = useState<string>('user');
<CustomMenu
  mode="inline"
  selectedKeys={[selectedKey]}
  defaultOpenKeys={['system']}
  items={[
    {
      key: 'system',
      icon: <AppstoreOutlined />,
      label: '시스템관리',
      children: [
        { key: 'user', icon: <TeamOutlined />, label: '사용자관리' },
        { key: 'code', label: '코드관리' },
      ],
    },
    { key: 'setting', icon: <SettingOutlined />, label: '환경설정' },
  ]}
  onClick={({ key }) => setSelectedKey(key)}
/>

// ② 수평 메뉴 (GNB)
<CustomMenu
  mode="horizontal"
  selectedKeys={[selectedKey]}
  items={[
    { key: 'home', icon: <HomeOutlined />, label: '홈' },
    { key: 'user', icon: <TeamOutlined />, label: '사용자관리' },
    { key: 'setting', icon: <SettingOutlined />, label: '환경설정', disabled: true },
  ]}
  onClick={({ key }) => setSelectedKey(key)}
/>

// ③ 축소 모드 (아이콘만)
const [collapsed, setCollapsed] = useState<boolean>(false);
<CustomMenu
  mode="inline"
  inlineCollapsed={collapsed}
  selectedKeys={[selectedKey]}
  items={[...]}
  onClick={({ key }) => setSelectedKey(key)}
/>

// ④ 세로 메뉴
<CustomMenu
  mode="vertical"
  selectedKeys={[selectedKey]}
  items={[...]}
  onClick={({ key }) => setSelectedKey(key)}
/>

// ── Props 정리 (MenuProps 확장) ──
// mode?: 'inline' | 'horizontal' | 'vertical' — 메뉴 모드
// selectedKeys?: string[] — 선택된 메뉴 키
// defaultOpenKeys?: string[] — 기본 펼쳐진 서브메뉴 키
// items: MenuItem[] — 메뉴 항목 배열 ({ key, icon?, label, children?, disabled? })
// onClick?: ({ key }) => void — 메뉴 클릭 콜백
// inlineCollapsed?: boolean — 인라인 모드 축소 여부`;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'system',
    icon: <AppstoreOutlined />,
    label: '시스템관리',
    children: [
      { key: 'user', icon: <TeamOutlined />, label: '사용자관리' },
      { key: 'code', icon: <FileTextOutlined />, label: '코드관리' },
    ],
  },
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: '환경설정',
  },
];

const NavigationLayoutGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenuKey, setSelectedMenuKey] = useState('user');

  return (
    <GuideSection id="navigation-layout" title="네비게이션 / 레이아웃 (Navigation & Layout)" description="메뉴, 탭, 페이지네이션 등 네비게이션 컴포넌트">
      {/* Breadcrumb */}
      <GuideDemoBox title="Breadcrumb (경로 표시)" codeExample={BREADCRUMB_CODE}>
        <div className="guide-nav-demo">
          <CustomBreadcrumb
            items={[
              { title: <><HomeOutlined /> 홈</> },
              { title: '시스템관리' },
              { title: '사용자관리' },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Tabs */}
      <GuideDemoBox title="Tabs (탭 전환)" codeExample={TABS_CODE}>
        <div className="guide-sub-section">
          <h5>기본 탭</h5>
          <CustomTabs
            defaultActiveKey="1"
            items={[
              { key: '1', label: '탭 메뉴 01', children: '탭 메뉴 01 내용' },
              { key: '2', label: '탭 메뉴 02', children: '탭 메뉴 02 내용' },
              { key: '3', label: '탭 메뉴 03', children: '탭 메뉴 03 내용' },
            ]}
          />
        </div>
        <div className="guide-sub-section">
          <h5>카드형 탭</h5>
          <CustomTabs
            type="card"
            items={[
              { key: '1', label: '탭 메뉴 01', children: '탭 메뉴 01 내용' },
              { key: '2', label: '탭 메뉴 02', children: '탭 메뉴 02 내용' },
            ]}
          />
        </div>
        <div className="guide-sub-section">
          <h5>비활성화 탭</h5>
          <CustomTabs
            items={[
              { key: '1', label: '탭 메뉴 01', children: '활성화된 탭' },
              { key: '2', label: '탭 메뉴 02', disabled: true },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Stepper / Wizard */}
      <GuideDemoBox title="Stepper / Wizard (단계별 진행)" codeExample={STEPS_CODE}>
        <CustomSteps
          current={currentStep}
          onChange={setCurrentStep}
          items={[
            { title: '기본정보', content: '필수 정보 입력', icon: <UserOutlined /> },
            { title: '상세설정', content: '추가 정보 입력', icon: <SettingOutlined /> },
            { title: '검토', content: '입력 내용 확인' },
            { title: '완료', content: '등록 완료' },
          ]}
        />
        <div className="guide-demo-description">
          현재 단계: {currentStep + 1}단계 (클릭하여 단계를 변경할 수 있습니다)
        </div>
      </GuideDemoBox>

      {/* Pagination */}
      <GuideDemoBox title="Pagination (페이지네이션)" codeExample={PAGINATION_CODE}>
        <GuideStatusRow>
          <GuideStatusItem label="기본">
            <CustomPagination
              current={currentPage}
              onChange={setCurrentPage}
              total={100}
              pageSize={10}
            />
          </GuideStatusItem>
        </GuideStatusRow>
        <GuideStatusRow>
          <GuideStatusItem label="간소화">
            <CustomPagination simple defaultCurrent={1} total={50} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <CustomPagination defaultCurrent={1} total={50} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* Menu */}
      <GuideDemoBox title="Menu (메뉴 네비게이션)" codeExample={MENU_CODE}>
        <div className="guide-sub-section">
          <h5>인라인 메뉴 (사이드바)</h5>
          <div style={{ width: 240, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <CustomMenu
              mode="inline"
              selectedKeys={[selectedMenuKey]}
              defaultOpenKeys={['system']}
              items={menuItems}
              onClick={({ key }) => setSelectedMenuKey(key)}
            />
          </div>
        </div>
        <div className="guide-sub-section">
          <h5>수평 메뉴 (GNB)</h5>
          <CustomMenu
            mode="horizontal"
            selectedKeys={[selectedMenuKey]}
            items={[
              { key: 'home', icon: <HomeOutlined />, label: '홈' },
              { key: 'user', icon: <TeamOutlined />, label: '사용자관리' },
              { key: 'setting', icon: <SettingOutlined />, label: '환경설정', disabled: true },
            ]}
            onClick={({ key }) => setSelectedMenuKey(key)}
          />
        </div>
        <div className="guide-demo-description">
          mode="inline" — 사이드바 / mode="horizontal" — 상단 GNB / inlineCollapsed — 아이콘 전용 축소 모드
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default NavigationLayoutGuide;
