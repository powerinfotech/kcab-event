/**
 * CustomBadge - Ant Design Badge 래퍼 컴포넌트
 *
 * [목적]
 * 숫자 뱃지(알림 카운트), 상태 점(status dot) 표시에 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomBadge from '@component/display/CustomBadge';
 *
 * // 숫자 뱃지
 * <CustomBadge count={5}>
 *   <BellOutlined />
 * </CustomBadge>
 *
 * // 상태 점
 * <CustomBadge status="success" text="정상" />
 * <CustomBadge status="error" text="오류" />
 *
 * // 최대 표시 수
 * <CustomBadge count={100} overflowCount={99}>
 *   <NotificationOutlined />
 * </CustomBadge>
 */
import React from 'react';
import {Badge, BadgeProps} from 'antd';

interface CustomBadgeProps extends BadgeProps {}

const CustomBadge = (props: CustomBadgeProps) => {
    return (
        <Badge {...props} />
    );
};

export default CustomBadge;
