/**
 * CustomEmpty / PRESENTED_IMAGE_SIMPLE - Ant Design Empty 래퍼 컴포넌트
 *
 * [목적]
 * 목록/테이블에 데이터가 없을 때 빈 상태 화면을 표시한다.
 *
 * [exports]
 * - default: CustomEmpty
 * - named:   PRESENTED_IMAGE_SIMPLE (Empty.PRESENTED_IMAGE_SIMPLE — 간결한 아이콘)
 *
 * [사용 방법]
 * @example
 * import CustomEmpty, { PRESENTED_IMAGE_SIMPLE } from '@component/layout/CustomEmpty';
 *
 * // 기본 빈 상태
 * <CustomEmpty description="조회 결과가 없습니다." />
 *
 * // 간결한 아이콘으로 변경
 * <CustomEmpty image={PRESENTED_IMAGE_SIMPLE} description="데이터 없음" />
 *
 * // CustomTable locale에 적용
 * <CustomTable locale={{ emptyText: <CustomEmpty description="조회 결과가 없습니다." /> }} ... />
 */
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
