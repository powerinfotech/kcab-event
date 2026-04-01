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
      <GuideDemoBox title="Breadcrumb (경로 표시)">
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
      <GuideDemoBox title="Tabs (탭 전환)">
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
      <GuideDemoBox title="Stepper / Wizard (단계별 진행)">
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
      <GuideDemoBox title="Pagination (페이지네이션)">
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
      <GuideDemoBox title="Menu (메뉴 네비게이션)">
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
