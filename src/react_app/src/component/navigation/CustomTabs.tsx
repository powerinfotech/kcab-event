import React from 'react';
import {Tabs, TabsProps} from 'antd';

interface CustomTabsProps extends TabsProps {}

const CustomTabs = (props: CustomTabsProps) => {
    return (
        <Tabs {...props} />
    );
};

export default CustomTabs;
