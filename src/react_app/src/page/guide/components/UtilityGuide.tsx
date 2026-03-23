import React from 'react';
import { Tooltip, Popover, Divider, Empty } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import CustomButton from '@component/CustomButton';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const UtilityGuide = () => {
  return (
    <GuideSection id="utility" title="유틸리티 컴포넌트" description="툴팁, 팝오버, 구분선 등 보조 컴포넌트">
      {/* Tooltip */}
      <GuideDemoBox title="Tooltip (툴팁)">
        <div className="guide-demo-row">
          <Tooltip title="기본 툴팁">
            <CustomButton>마우스를 올려보세요</CustomButton>
          </Tooltip>
          <Tooltip title="상단 표시" placement="top">
            <CustomButton>상단</CustomButton>
          </Tooltip>
          <Tooltip title="우측 표시" placement="right">
            <CustomButton>우측</CustomButton>
          </Tooltip>
          <Tooltip title="하단 표시" placement="bottom">
            <CustomButton>하단</CustomButton>
          </Tooltip>
        </div>
      </GuideDemoBox>

      {/* Popover */}
      <GuideDemoBox title="Popover (팝오버)">
        <div className="guide-demo-row">
          <Popover
            title="상세 정보"
            content={
              <div>
                <p>이름: 홍길동</p>
                <p>부서: 개발팀</p>
                <p>직급: 과장</p>
              </div>
            }
          >
            <CustomButton icon={<InfoCircleOutlined />}>클릭하여 정보 보기</CustomButton>
          </Popover>
          <Popover
            title="도움말"
            content="이 버튼은 데이터를 저장합니다."
            trigger="hover"
          >
            <CustomButton>Hover 팝오버</CustomButton>
          </Popover>
        </div>
      </GuideDemoBox>

      {/* Divider */}
      <GuideDemoBox title="Divider (구분선)">
        <div>
          <p>위쪽 내용</p>
          <Divider />
          <p>아래쪽 내용</p>
          <Divider dashed />
          <p>점선 구분</p>
          <Divider orientation="left">좌측 텍스트</Divider>
          <p>좌측 텍스트 구분선</p>
          <Divider orientation="center">중앙 텍스트</Divider>
          <p>중앙 텍스트 구분선</p>
        </div>
      </GuideDemoBox>

      {/* Empty */}
      <GuideDemoBox title="Empty (데이터 없음 표시)">
        <GuideStatusRow>
          <GuideStatusItem label="기본">
            <Empty description="데이터가 없습니다" />
          </GuideStatusItem>
          <GuideStatusItem label="심플">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="검색 결과 없음" />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>

      {/* ErrorBoundary */}
      <GuideDemoBox title="ErrorBoundary (에러 바운더리)">
        <div className="guide-demo-description">
          ErrorBoundary는 하위 컴포넌트에서 발생하는 JavaScript 에러를 캐치하여
          전체 애플리케이션이 크래시되는 것을 방지합니다.
          <br /><br />
          사용 패턴:
          <br />- 페이지 단위로 ErrorBoundary를 감싸서 한 페이지의 오류가 다른 페이지에 영향을 주지 않도록 합니다.
          <br />- 현재 프로젝트에서는 showErrorPageAtom을 통한 전역 에러 페이지로 처리합니다.
        </div>
      </GuideDemoBox>

      {/* AuthGuard / PermissionButton */}
      <GuideDemoBox title="AuthGuard / PermissionButton (권한 컴포넌트)">
        <div className="guide-demo-description">
          권한 관련 컴포넌트는 현재 프로젝트에서 다음과 같이 처리됩니다:
          <br /><br />
          - AuthGuard: GlobalAxiosProvider에서 401 에러 시 자동 로그인 페이지 리다이렉트
          <br />- PermissionButton: MenuButtonBar 컴포넌트에서 메뉴별 버튼 권한을 동적으로 렌더링
          <br />- FormValidator: react-hook-form의 Controller + rules 조합으로 폼 유효성 검증
          <br /><br />
          관련 파일:
          <br />- src/provider/GlobalAxiosProvider.tsx
          <br />- src/component/MenuButtonBar.tsx
          <br />- src/component/form/CustomSaveForm*.tsx
        </div>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default UtilityGuide;
