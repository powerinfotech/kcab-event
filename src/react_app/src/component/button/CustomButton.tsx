import React from 'react';
import {Button, ButtonProps} from 'antd';

interface CustomButtonProps  extends ButtonProps {
    [key: string]: any;
};

const CustomButton  = (props:CustomButtonProps) => {
    return (
        <Button {...props} />
    );
};

export default CustomButton;