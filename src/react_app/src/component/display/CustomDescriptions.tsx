import React from 'react';
import {Descriptions} from 'antd';
import type {DescriptionsProps} from 'antd';

interface CustomDescriptionsProps extends DescriptionsProps {}

const CustomDescriptions = (props: CustomDescriptionsProps) => {
    return (
        <Descriptions {...props} />
    );
};

export const CustomDescriptionsItem = Descriptions.Item;

export default CustomDescriptions;
