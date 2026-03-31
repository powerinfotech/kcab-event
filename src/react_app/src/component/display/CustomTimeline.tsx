/**
 * CustomTimeline - Ant Design Timeline 래퍼 컴포넌트
 *
 * [목적]
 * 이벤트 이력, 처리 단계, 시간순 로그 등을 세로 타임라인으로 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomTimeline from '@component/display/CustomTimeline';
 *
 * <CustomTimeline
 *   items={[
 *     { color: 'green', children: '신청 접수 (2024-01-01)' },
 *     { color: 'blue',  children: '검토 중 (2024-01-03)' },
 *     { color: 'red',   children: '반려 (2024-01-05)', dot: <CloseCircleOutlined /> },
 *   ]}
 * />
 */
import React from 'react';
import {Timeline, TimelineProps} from 'antd';

interface CustomTimelineProps extends TimelineProps {}

const CustomTimeline = (props: CustomTimelineProps) => {
    return (
        <Timeline {...props} />
    );
};

export default CustomTimeline;
