import React, { useState } from 'react';
import { Breadcrumb, Tabs, Steps, Pagination } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const NavigationLayoutGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <GuideSection id="navigation-layout" title="네비게이션 / 레이아웃 (Navigation & Layout)" description="메뉴, 탭, 페이지네이션 등 네비게이션 컴포넌트">
      {/* Breadcrumb */}
      <GuideDemoBox title="Breadcrumb (경로 표시)">
        <div className="guide-nav-demo">
          <Breadcrumb
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
          <Tabs
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
          <Tabs
            type="card"
            items={[
              { key: '1', label: '탭 메뉴 01', children: '탭 메뉴 01 내용' },
              { key: '2', label: '탭 메뉴 02', children: '탭 메뉴 02 내용' },
            ]}
          />
        </div>
        <div className="guide-sub-section">
          <h5>비활성화 탭</h5>
          <Tabs
            items={[
              { key: '1', label: '탭 메뉴 01', children: '활성화된 탭' },
              { key: '2', label: '탭 메뉴 02', disabled: true },
            ]}
          />
        </div>
      </GuideDemoBox>

      {/* Stepper / Wizard */}
      <GuideDemoBox title="Stepper / Wizard (단계별 진행)">
        <Steps
          current={currentStep}
          onChange={setCurrentStep}
          items={[
            { title: '기본정보', description: '필수 정보 입력', icon: <UserOutlined /> },
            { title: '상세설정', description: '추가 정보 입력', icon: <SettingOutlined /> },
            { title: '검토', description: '입력 내용 확인' },
            { title: '완료', description: '등록 완료' },
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
            <Pagination
              current={currentPage}
              onChange={setCurrentPage}
              total={100}
              pageSize={10}
            />
          </GuideStatusItem>
        </GuideStatusRow>
        <GuideStatusRow>
          <GuideStatusItem label="간소화">
            <Pagination simple defaultCurrent={1} total={50} />
          </GuideStatusItem>
          <GuideStatusItem label="disabled">
            <Pagination defaultCurrent={1} total={50} disabled />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* Layout 안내 */}
      <GuideDemoBox title="Layout (레이아웃 구조)">
        <div className="guide-demo-description">
          현재 프로젝트의 레이아웃은 다음 구조를 사용합니다:
          <br />- Header (TopBar): 상단 네비게이션 바
          <br />- Sidebar: 좌측 메뉴 (72px 좁은 메뉴 + 280px 서브패널)
          <br />- Content: 메인 콘텐츠 영역 (.container_wrap &gt; .container_inner)
          <br />- Footer: 하단 영역
          <br />
          <br />레이아웃 컴포넌트 위치:
          <br />- src/layout/Header.tsx
          <br />- src/layout/Sidebar.tsx
          <br />- src/layout/Footer.tsx
          <br />- src/layout/TopBar.tsx
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default NavigationLayoutGuide;
