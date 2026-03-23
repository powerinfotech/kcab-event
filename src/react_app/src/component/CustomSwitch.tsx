import React from 'react';
import {Switch, SwitchProps} from 'antd';

interface CustomSwitchProps extends SwitchProps {}

const CustomSwitch = (props: CustomSwitchProps) => {
    return (
        <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            {...props}
        />
    );
};

export default CustomSwitch;
