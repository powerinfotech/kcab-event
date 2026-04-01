/**
 * CustomDivider - Ant Design Divider 래퍼 컴포넌트
 *
 * [목적]
 * 콘텐츠 섹션 사이에 가로/세로 구분선을 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomDivider from '@component/layout/CustomDivider';
 *
 * // 가로 구분선
 * <CustomDivider />
 *
 * // 텍스트 포함 구분선
 * <CustomDivider>기본 정보</CustomDivider>
 *
 * // 텍스트 정렬
 * <CustomDivider titlePlacement="left">검색 조건</CustomDivider>
 *
 * // 세로 구분선 (인라인 요소 사이)
 * <span>항목1</span>
 * <CustomDivider type="vertical" />
 * <span>항목2</span>
 */
import React from 'react';
import {Divider, DividerProps} from 'antd';

interface CustomDividerProps extends DividerProps {}

const CustomDivider = (props: CustomDividerProps) => {
    return (
        <Divider {...props} />
    );
};

export default CustomDivider;
