import React from 'react';
import {Divider, DividerProps} from 'antd';

interface CustomDividerProps extends DividerProps {}

const CustomDivider = (props: CustomDividerProps) => {
    return (
        <Divider {...props} />
    );
};

export default CustomDivider;
