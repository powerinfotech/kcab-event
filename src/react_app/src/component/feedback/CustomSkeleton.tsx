/**
 * CustomSkeleton - Ant Design Skeleton 래퍼 컴포넌트
 *
 * [목적]
 * 데이터 로딩 중 빈 화면 대신 스켈레톤 UI를 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * // 로딩 중 스켈레톤 표시
 * <CustomSkeleton loading={isLoading} active>
 *   <div>실제 콘텐츠</div>
 * </CustomSkeleton>
 *
 * // 이미지 + 텍스트 형태
 * <CustomSkeleton avatar paragraph={{ rows: 3 }} loading={isLoading} active>
 *   <UserProfile />
 * </CustomSkeleton>
 */
import React from 'react';
import {Skeleton, SkeletonProps} from 'antd';

interface CustomSkeletonProps extends SkeletonProps {}

const CustomSkeleton = (props: CustomSkeletonProps) => {
    return (
        <Skeleton {...props} />
    );
};

export default CustomSkeleton;
