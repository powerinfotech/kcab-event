import React from 'react';
import {FloatButton} from 'antd';
import type {FloatButtonProps, FloatButtonGroupProps} from 'antd/es/float-button/interface';

interface CustomFloatButtonProps extends FloatButtonProps {}

const CustomFloatButton = (props: CustomFloatButtonProps) => {
    return (
        <FloatButton {...props} />
    );
};

interface CustomFloatButtonGroupProps extends FloatButtonGroupProps {}

const CustomFloatButtonGroup = (props: CustomFloatButtonGroupProps) => {
    return (
        <FloatButton.Group {...props} />
    );
};

export { CustomFloatButtonGroup };
export default CustomFloatButton;
