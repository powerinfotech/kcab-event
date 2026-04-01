/**
 * CustomSpace - Ant Design Space 래퍼 컴포넌트
 *
 * [목적]
 * 인라인 요소(버튼, 태그, 아이콘 등) 사이에 일정한 간격을 부여할 때 사용한다.
 * CSS margin/gap을 직접 쓰는 대신 Space로 감싸면 간격을 일관되게 관리할 수 있다.
 *
 * [사용 방법]
 * @example
 * import CustomSpace from '@component/layout/CustomSpace';
 *
 * // 기본 버튼 그룹
 * <CustomSpace>
 *   <CustomButton type="primary" onClick={handleSave}>저장</CustomButton>
 *   <CustomButton onClick={handleCancel}>취소</CustomButton>
 * </CustomSpace>
 *
 * // 간격 크기 지정 (small | middle | large | number)
 * <CustomSpace size="middle">
 *   <CustomTag color="green">승인</CustomTag>
 *   <CustomTag color="red">반려</CustomTag>
 * </CustomSpace>
 *
 * // 세로 방향
 * <CustomSpace orientation="vertical" style={{ width: '100%' }}>
 *   <CustomInput placeholder="아이디" />
 *   <CustomInput placeholder="비밀번호" />
 * </CustomSpace>
 *
 * // wrap (줄바꿈 허용)
 * <CustomSpace wrap>
 *   {tags.map((tag) => <CustomTag key={tag}>{tag}</CustomTag>)}
 * </CustomSpace>
 *
 * // 구분선 포함
 * <CustomSpace split={<CustomDivider type="vertical" />}>
 *   <a>수정</a>
 *   <a>삭제</a>
 *   <a>상세</a>
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
