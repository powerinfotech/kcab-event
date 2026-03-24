import React from 'react';
import {Tooltip, TooltipProps} from 'antd';

interface CustomTooltipProps extends TooltipProps {}

const CustomTooltip = (props: CustomTooltipProps) => {
    return (
        <Tooltip {...props} />
    );
};

export default CustomTooltip;
