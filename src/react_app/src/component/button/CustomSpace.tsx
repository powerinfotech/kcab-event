/**
 * CustomSpace - Ant Design Space 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design Space를 프로젝트 공통 컴포넌트로 래핑한다.
 * 버튼 그룹, 인라인 요소 간격 정렬에 사용한다.
 *
 * [사용 방법]
 * @example
 * // 버튼 그룹
 * <CustomSpace>
 *   <CustomButton type="primary">저장</CustomButton>
 *   <CustomButton>취소</CustomButton>
 * </CustomSpace>
 *
 * // 간격 지정
 * <CustomSpace size="large" orientation="vertical">
 *   <CustomInput placeholder="이름" />
 *   <CustomInput placeholder="이메일" />
 * </CustomSpace>
 */
import React from 'react';
import {Space, SpaceProps} from 'antd';

interface CustomSpaceProps extends SpaceProps {}

const CustomSpace = (props: CustomSpaceProps) => {
    return (
        <Space {...props} />
    );
};

export default CustomSpace;
