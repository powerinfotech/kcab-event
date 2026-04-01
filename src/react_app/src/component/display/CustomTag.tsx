/**
 * CustomTag - Ant Design Tag 래퍼 컴포넌트
 *
 * [목적]
 * 상태, 카테고리, 라벨 등을 태그 형태로 표시할 때 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomTag from '@component/display/CustomTag';
 *
 * // 색상 태그
 * <CustomTag color="green">승인</CustomTag>
 * <CustomTag color="red">반려</CustomTag>
 * <CustomTag color="blue">처리중</CustomTag>
 *
 * // 닫기 버튼 포함
 * <CustomTag closable onClose={() => removeTag(tag)}>
 *   {tag}
 * </CustomTag>
 */
import React from 'react';
import {Tag, TagProps} from 'antd';

interface CustomTagProps extends TagProps {}

const CustomTag = (props: CustomTagProps) => {
    return (
        <Tag {...props} />
    );
};

export default CustomTag;
