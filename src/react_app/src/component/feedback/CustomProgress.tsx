/**
 * CustomProgress - Ant Design Progress 래퍼 컴포넌트
 *
 * [목적]
 * 작업 진행률, 파일 업로드 상태, 단계 완료율 등을 시각적으로 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * // 기본 진행바
 * <CustomProgress percent={70} />
 *
 * // 원형 진행바
 * <CustomProgress type="circle" percent={85} />
 *
 * // 상태별 색상
 * <CustomProgress percent={100} status="success" />
 * <CustomProgress percent={50} status="exception" />
 *
 * // 색상 커스터마이징
 * <CustomProgress percent={60} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
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
