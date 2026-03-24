import React from 'react';
import {Input} from 'antd';
import type {PasswordProps} from 'antd/es/input';

interface CustomPasswordProps extends PasswordProps {}

const CustomPassword = (props: CustomPasswordProps) => {
    return (
        <Input.Password {...props} />
    );
};

export default CustomPassword;
