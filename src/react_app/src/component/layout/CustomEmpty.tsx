import React from 'react';
import {Empty} from 'antd';
import type {EmptyProps} from 'antd';

interface CustomEmptyProps extends EmptyProps {}

const CustomEmpty = (props: CustomEmptyProps) => {
    return (
        <Empty {...props} />
    );
};

export const PRESENTED_IMAGE_SIMPLE = Empty.PRESENTED_IMAGE_SIMPLE;

export default CustomEmpty;
