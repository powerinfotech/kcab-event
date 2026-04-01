/**
 * CustomCard - Ant Design Card 래퍼 컴포넌트
 *
 * [목적]
 * 콘텐츠 영역을 카드 형태로 감싸는 레이아웃 컴포넌트다.
 * 제목·부가액션·탭 등을 포함한 구역 구분에 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomCard from '@component/display/CustomCard';
 *
 * // 기본 카드
 * <CustomCard title="사용자 정보">
 *   <p>내용</p>
 * </CustomCard>
 *
 * // 추가 액션 버튼
 * <CustomCard
 *   title="목록"
 *   extra={<CustomButton size="small">더보기</CustomButton>}
 * >
 *   <CustomTable ... />
 * </CustomCard>
 *
 * // 테두리 없음
 * <CustomCard bordered={false}>
 *   <p>내용</p>
 * </CustomCard>
 */
import React from 'react';
import {Card, CardProps} from 'antd';

interface CustomCardProps extends CardProps {}

const CustomCard = (props: CustomCardProps) => {
    return (
        <Card {...props} />
    );
};

export default CustomCard;
