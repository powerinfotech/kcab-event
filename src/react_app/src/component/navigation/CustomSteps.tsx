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
 * // 기본 단계 표시
 * <CustomSteps
 *   current={currentStep}
 *   items={[
 *     { title: '신청', description: '신청서 작성' },
 *     { title: '검토', description: '담당자 검토' },
 *     { title: '승인', description: '최종 승인' },
 *   ]}
 * />
 *
 * // 오류 상태
 * <CustomSteps
 *   current={1}
 *   status="error"
 *   items={[
 *     { title: '업로드 완료' },
 *     { title: '검증 실패', description: '파일 형식 오류' },
 *     { title: '처리' },
 *   ]}
 * />
 *
 * // 세로 방향
 * <CustomSteps
 *   direction="vertical"
 *   current={currentStep}
 *   items={[
 *     { title: '접수', description: '2024-01-01' },
 *     { title: '처리 중', description: '2024-01-03' },
 *     { title: '완료' },
 *   ]}
 * />
 *
 * // 클릭 가능 단계 (onChange 제공)
 * <CustomSteps
 *   current={currentStep}
 *   onChange={setCurrentStep}
 *   items={[
 *     { title: '기본 정보' },
 *     { title: '상세 설정' },
 *     { title: '완료' },
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
