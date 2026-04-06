import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import CustomButton from '@component/button/CustomButton';
import CustomTooltip from '@component/feedback/CustomTooltip';
import CustomPopover from '@component/feedback/CustomPopover';
import CustomDivider from '@component/layout/CustomDivider';
import { GuideSection, GuideDemoBox, GuideStatusRow, GuideStatusItem } from './GuideSection';

/* ───────── 코드 예제 상수 ───────── */

const TOOLTIP_CODE = `import CustomTooltip from '@component/feedback/CustomTooltip';

// ① 기본 사용
<CustomTooltip title="기본 툴팁">
  <CustomButton>마우스를 올려보세요</CustomButton>
</CustomTooltip>

// ② 위치 지정
<CustomTooltip title="상단 표시" placement="top">
  <CustomButton>상단</CustomButton>
</CustomTooltip>

// ③ 다양한 위치
<CustomTooltip title="우측 표시" placement="right">...</CustomTooltip>
<CustomTooltip title="하단 표시" placement="bottom">...</CustomTooltip>

// ── Props 정리 ──
// title      - 툴팁 내용 (string | ReactNode)
// placement  - 위치 (top, bottom, left, right 등)
// children   - 툴팁 대상 요소
// Ant Design TooltipProps 확장`;

const POPOVER_CODE = `import CustomPopover from '@component/feedback/CustomPopover';

// ① 클릭 트리거 (기본)
<CustomPopover
  title="상세 정보"
  content={
    <div>
      <p>이름: 홍길동</p>
      <p>부서: 개발팀</p>
    </div>
  }
>
  <CustomButton>클릭하여 정보 보기</CustomButton>
</CustomPopover>

// ② hover 트리거
<CustomPopover
  title="도움말"
  content="이 버튼은 데이터를 저장합니다."
  trigger="hover"
>
  <CustomButton>Hover 팝오버</CustomButton>
</CustomPopover>

// ── Props 정리 ──
// title     - 팝오버 제목
// content   - 팝오버 내용 (string | ReactNode)
// trigger   - 트리거 방식 ('click' | 'hover' | 'focus')
// placement - 위치
// children  - 팝오버 대상 요소
// Ant Design PopoverProps 확장`;

const DIVIDER_CODE = `import CustomDivider from '@component/layout/CustomDivider';

// ① 기본 수평 구분선
<CustomDivider />

// ② 점선
<CustomDivider dashed />

// ③ 텍스트 포함 (위치 지정)
<CustomDivider titlePlacement="left">좌측 텍스트</CustomDivider>
<CustomDivider titlePlacement="center">중앙 텍스트</CustomDivider>

// ④ 수직 구분선
<CustomDivider type="vertical" />

// ── Props 정리 ──
// type            - 'horizontal' | 'vertical' (기본: horizontal)
// titlePlacement  - 텍스트 위치 ('left' | 'center' | 'right')
// dashed          - 점선 여부
// children        - 구분선 내 텍스트
// Ant Design DividerProps 확장`;

const UtilityGuide = () => {
  return (
    <GuideSection id="utility" title="유틸리티 컴포넌트" description="툴팁, 팝오버, 구분선 등 보조 컴포넌트">
      {/* Tooltip */}
      <GuideDemoBox title="Tooltip (툴팁)" codeExample={TOOLTIP_CODE}>
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
      <GuideDemoBox title="Popover (팝오버)" codeExample={POPOVER_CODE}>
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
      <GuideDemoBox title="Divider (구분선)" codeExample={DIVIDER_CODE}>
        <div>
          <p>위쪽 내용</p>
          <CustomDivider />
          <p>아래쪽 내용</p>
          <CustomDivider dashed />
          <p>점선 구분</p>
          <CustomDivider titlePlacement="left">좌측 텍스트</CustomDivider>
          <p>좌측 텍스트 구분선</p>
          <CustomDivider titlePlacement="center">중앙 텍스트</CustomDivider>
          <p>중앙 텍스트 구분선</p>
        </div>
      </GuideDemoBox>

    </GuideSection>
  );
};

export default UtilityGuide;
