import React from 'react';
import {Tag, TagProps} from 'antd';

interface CustomTagProps extends TagProps {}

const CustomTag = (props: CustomTagProps) => {
    return (
        <Tag {...props} />
    );
};

export default CustomTag;
