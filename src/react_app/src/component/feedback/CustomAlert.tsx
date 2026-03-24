import React from 'react';
import {Alert, AlertProps} from 'antd';

interface CustomAlertProps extends AlertProps {}

const CustomAlert = (props: CustomAlertProps) => {
    return (
        <Alert {...props} />
    );
};

export default CustomAlert;
