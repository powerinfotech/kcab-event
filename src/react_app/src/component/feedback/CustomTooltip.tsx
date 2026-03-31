/**
 * CustomTooltip - Ant Design Tooltip 래퍼 컴포넌트
 *
 * [목적]
 * 마우스 오버 시 간단한 설명 텍스트를 말풍선으로 표시할 때 사용한다.
 * 입력 오류 표시는 각 폼 컴포넌트 내부에서 처리하므로,
 * 일반적인 안내 툴팁에만 사용한다.
 *
 * [사용 방법]
 * @example
 * // 기본 툴팁
 * <CustomTooltip title="클릭하면 저장됩니다.">
 *   <CustomButton type="primary">저장</CustomButton>
 * </CustomTooltip>
 *
 * // 위치 지정
 * <CustomTooltip title="도움말" placement="right">
 *   <QuestionCircleOutlined />
 * </CustomTooltip>
 */
import React from 'react';
import {Tooltip, TooltipProps} from 'antd';

interface CustomTooltipProps extends TooltipProps {}

const CustomTooltip = (props: CustomTooltipProps) => {
    return (
        <Tooltip {...props} />
    );
};

export default CustomTooltip;
