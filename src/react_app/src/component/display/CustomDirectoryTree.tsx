import React from 'react';
import {Tree} from 'antd';
import type {DirectoryTreeProps} from 'antd/es/tree';

interface CustomDirectoryTreeProps extends DirectoryTreeProps {}

const CustomDirectoryTree = (props: CustomDirectoryTreeProps) => {
    return (
        <Tree.DirectoryTree {...props} />
    );
};

export default CustomDirectoryTree;
