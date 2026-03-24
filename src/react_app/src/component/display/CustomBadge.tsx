import React from 'react';
import {Badge, BadgeProps} from 'antd';

interface CustomBadgeProps extends BadgeProps {}

const CustomBadge = (props: CustomBadgeProps) => {
    return (
        <Badge {...props} />
    );
};

export default CustomBadge;
