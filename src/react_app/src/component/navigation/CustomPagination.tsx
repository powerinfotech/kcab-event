/**
 * CustomPagination - Ant Design Pagination 래퍼 컴포넌트
 *
 * [목적]
 * 목록 하단에 페이지 네비게이션을 표시할 때 사용한다.
 * 테이블에 내장된 페이징 대신 별도 배치가 필요할 때 사용한다.
 * 일반적으로는 CustomTable의 pagination 속성을 사용하는 것이 권장된다.
 *
 * [사용 방법]
 * @example
 * import CustomPagination from '@component/navigation/CustomPagination';
 *
 * <CustomPagination
 *   current={currentPage}
 *   pageSize={10}
 *   total={totalCount}
 *   onChange={(page, pageSize) => fetchData(page, pageSize)}
 *   showSizeChanger
 *   showTotal={(total) => `총 ${total}건`}
 * />
 */
import React from 'react';
import {Pagination, PaginationProps} from 'antd';

interface CustomPaginationProps extends PaginationProps {}

const CustomPagination = (props: CustomPaginationProps) => {
    return (
        <Pagination {...props} />
    );
};

export default CustomPagination;
