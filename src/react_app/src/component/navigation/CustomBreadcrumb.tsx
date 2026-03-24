import React from 'react';
import {Breadcrumb, BreadcrumbProps} from 'antd';

interface CustomBreadcrumbProps extends BreadcrumbProps {}

const CustomBreadcrumb = (props: CustomBreadcrumbProps) => {
    return (
        <Breadcrumb {...props} />
    );
};

export default CustomBreadcrumb;
