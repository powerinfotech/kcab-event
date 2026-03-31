/**
 * CustomStatistic - Ant Design Statistic 래퍼 컴포넌트
 *
 * [목적]
 * 대시보드에서 주요 수치(총 사용자 수, 오늘 접속자 수 등)를 강조 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomStatistic from '@component/display/CustomStatistic';
 *
 * // 기본 수치
 * <CustomStatistic title="총 사용자" value={1234} />
 *
 * // 접두/접미사
 * <CustomStatistic title="오늘 매출" prefix="₩" value={1500000} />
 *
 * // 소수점 / 증감 표시
 * <CustomStatistic title="전환율" value={93.1} precision={2} suffix="%" />
 */
import React from 'react';
import {Statistic, StatisticProps} from 'antd';

interface CustomStatisticProps extends StatisticProps {}

const CustomStatistic = (props: CustomStatisticProps) => {
    return (
        <Statistic {...props} />
    );
};

export default CustomStatistic;
