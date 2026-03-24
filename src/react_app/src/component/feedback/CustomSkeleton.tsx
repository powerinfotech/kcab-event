import React from 'react';
import {Skeleton, SkeletonProps} from 'antd';

interface CustomSkeletonProps extends SkeletonProps {}

const CustomSkeleton = (props: CustomSkeletonProps) => {
    return (
        <Skeleton {...props} />
    );
};

export default CustomSkeleton;
