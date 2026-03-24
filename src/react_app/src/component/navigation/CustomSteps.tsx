import React from 'react';
import {Steps, StepsProps} from 'antd';

interface CustomStepsProps extends StepsProps {}

const CustomSteps = (props: CustomStepsProps) => {
    return (
        <Steps {...props} />
    );
};

export default CustomSteps;
