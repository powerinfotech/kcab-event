/**
 * CustomSteps - Ant Design Steps 래퍼 컴포넌트
 *
 * [목적]
 * 다단계 프로세스의 현재 단계를 시각적으로 표시할 때 사용한다.
 * 신청 → 검토 → 승인 등의 워크플로우 표시에 활용한다.
 *
 * [사용 방법]
 * @example
 * import CustomSteps from '@component/navigation/CustomSteps';
 *
 * <CustomSteps
 *   current={currentStep}
 *   items={[
 *     { title: '신청', description: '신청서 작성' },
 *     { title: '검토', description: '담당자 검토' },
 *     { title: '승인', description: '최종 승인' },
 *   ]}
 * />
 */
import React from 'react';
import {Steps, StepsProps} from 'antd';

interface CustomStepsProps extends StepsProps {}

const CustomSteps = (props: CustomStepsProps) => {
    return (
        <Steps {...props} />
    );
};

export default CustomSteps;
