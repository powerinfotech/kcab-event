import React from 'react';
import {Space, SpaceProps} from 'antd';

interface CustomSpaceProps extends SpaceProps {}

const CustomSpace = (props: CustomSpaceProps) => {
    return (
        <Space {...props} />
    );
};

export default CustomSpace;
