import React from 'react';
import {Progress, ProgressProps} from 'antd';

interface CustomProgressProps extends ProgressProps {}

const CustomProgress = (props: CustomProgressProps) => {
    return (
        <Progress {...props} />
    );
};

export default CustomProgress;
