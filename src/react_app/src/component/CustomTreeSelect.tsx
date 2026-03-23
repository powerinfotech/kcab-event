import React from 'react';
import {TreeSelect, TreeSelectProps} from 'antd';

interface CustomTreeSelectProps extends TreeSelectProps {}

const CustomTreeSelect = (props: CustomTreeSelectProps) => {
    return (
        <TreeSelect
            treeDefaultExpandAll
            allowClear
            {...props}
        />
    );
};

export default CustomTreeSelect;
