import React from 'react';
import {Pagination, PaginationProps} from 'antd';

interface CustomPaginationProps extends PaginationProps {}

const CustomPagination = (props: CustomPaginationProps) => {
    return (
        <Pagination {...props} />
    );
};

export default CustomPagination;
