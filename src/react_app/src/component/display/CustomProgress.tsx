/**
 * CustomProgress - Ant Design Progress 래퍼 컴포넌트
 *
 * [목적]
 * 파일 업로드, 작업 처리, 달성률 등 진행 상태를 시각적으로 표시할 때 사용한다.
 * 선형(line), 원형(circle), 대시보드(dashboard) 타입을 지원한다.
 *
 * [사용 방법]
 * @example
 * import CustomProgress from '@component/display/CustomProgress';
 *
 * // 기본 선형 진행률
 * <CustomProgress percent={70} />
 *
 * // 성공/실패 상태
 * <CustomProgress percent={100} status="success" />
 * <CustomProgress percent={45} status="exception" />
 *
 * // 원형
 * <CustomProgress type="circle" percent={75} />
 *
 * // 대시보드형
 * <CustomProgress type="dashboard" percent={80} />
 *
 * // 단계별 (steps)
 * <CustomProgress steps={5} percent={60} />
 *
 * // 색상 커스텀
 * <CustomProgress percent={50} strokeColor="#52c41a" />
 */
import React from 'react';
import {Progress, ProgressProps} from 'antd';

interface CustomProgressProps extends ProgressProps {}

const CustomProgress = (props: CustomProgressProps) => {
    return (
        <Progress {...props} />
    );
};

export default CustomProgress;
