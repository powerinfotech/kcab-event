import React from 'react';
import {Input} from 'antd';
import type {TextAreaProps} from 'antd/es/input';

const {TextArea} = Input;

interface CustomTextAreaProps extends TextAreaProps {}

const CustomTextArea = (props: CustomTextAreaProps) => {
    return (
        <TextArea {...props} />
    );
};

export default CustomTextArea;
