/**
 * CustomPopover - Ant Design Popover 래퍼 컴포넌트
 *
 * [목적]
 * 요소 위에 풍선 형태의 팝오버를 표시할 때 사용한다.
 * 간단한 안내, 추가 설명, 미니 폼 등에 활용한다.
 *
 * [사용 방법]
 * @example
 * <CustomPopover
 *   title="도움말"
 *   content={<p>이 항목은 필수 입력입니다.</p>}
 *   trigger="hover"
 * >
 *   <QuestionCircleOutlined />
 * </CustomPopover>
 *
 * // 클릭 트리거
 * <CustomPopover title="상세 정보" content={<DetailContent />} trigger="click">
 *   <CustomButton>상세</CustomButton>
 * </CustomPopover>
 */
import React from 'react';
import {Popover, PopoverProps} from 'antd';

interface CustomPopoverProps extends PopoverProps {}

const CustomPopover = (props: CustomPopoverProps) => {
    return (
        <Popover {...props} />
    );
};

export default CustomPopover;
