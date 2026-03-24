import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import CustomTooltip from '@component/feedback/CustomTooltip';
import CustomPopover from '@component/feedback/CustomPopover';
import CustomDivider from '@component/layout/CustomDivider';
import CustomEmpty, { PRESENTED_IMAGE_SIMPLE } from '@component/layout/CustomEmpty';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

const UtilityGuide = () => {
  return (
    <GuideSection id="utility" title="유틸리티 컴포넌트" description="툴팁, 팝오버, 구분선 등 보조 컴포넌트">
      {/* Tooltip */}
      <GuideDemoBox title="Tooltip (툴팁)">
        <div className="guide-demo-row">
          <CustomTooltip title="기본 툴팁">
            <CustomButton>마우스를 올려보세요</CustomButton>
          </CustomTooltip>
          <CustomTooltip title="상단 표시" placement="top">
            <CustomButton>상단</CustomButton>
          </CustomTooltip>
          <CustomTooltip title="우측 표시" placement="right">
            <CustomButton>우측</CustomButton>
          </CustomTooltip>
          <CustomTooltip title="하단 표시" placement="bottom">
            <CustomButton>하단</CustomButton>
          </CustomTooltip>
        </div>
      </GuideDemoBox>

      {/* Popover */}
      <GuideDemoBox title="Popover (팝오버)">
        <div className="guide-demo-row">
          <CustomPopover
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
          </CustomPopover>
          <CustomPopover
            title="도움말"
            content="이 버튼은 데이터를 저장합니다."
            trigger="hover"
          >
            <CustomButton>Hover 팝오버</CustomButton>
          </CustomPopover>
        </div>
      </GuideDemoBox>

      {/* Divider */}
      <GuideDemoBox title="Divider (구분선)">
        <div>
          <p>위쪽 내용</p>
          <CustomDivider />
          <p>아래쪽 내용</p>
          <CustomDivider dashed />
          <p>점선 구분</p>
          <CustomDivider orientation="left">좌측 텍스트</CustomDivider>
          <p>좌측 텍스트 구분선</p>
          <CustomDivider orientation="center">중앙 텍스트</CustomDivider>
          <p>중앙 텍스트 구분선</p>
        </div>
      </GuideDemoBox>

      {/* Empty */}
      <GuideDemoBox title="Empty (데이터 없음 표시)">
        <GuideStatusRow>
          <GuideStatusItem label="기본">
            <CustomEmpty description="데이터가 없습니다" />
          </GuideStatusItem>
          <GuideStatusItem label="심플">
            <CustomEmpty image={PRESENTED_IMAGE_SIMPLE} description="검색 결과 없음" />
          </GuideStatusItem>
        </GuideStatusRow>
      </GuideDemoBox>
    </GuideSection>
  );
};

export default UtilityGuide;
