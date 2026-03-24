import React from 'react';
import {InputNumber, InputNumberProps} from 'antd';

interface CustomInputNumberProps extends InputNumberProps {}

const CustomInputNumber = (props: CustomInputNumberProps) => {
    return (
        <InputNumber {...props} />
    );
};

export default CustomInputNumber;
