/**
 * CustomEmpty - Ant Design Empty 래퍼 컴포넌트
 *
 * [목적]
 * 데이터가 없는 상태를 사용자에게 시각적으로 안내할 때 사용한다.
 * 테이블, 리스트, 검색 결과 등이 비어 있을 때 배치한다.
 *
 * [사용 방법]
 * @example
 * import CustomEmpty from '@component/display/CustomEmpty';
 *
 * // 기본 빈 상태
 * <CustomEmpty />
 *
 * // 설명 문구 변경
 * <CustomEmpty description="검색 결과가 없습니다." />
 *
 * // 설명 제거
 * <CustomEmpty description={false} />
 *
 * // 하위 버튼 포함
 * <CustomEmpty description="등록된 데이터가 없습니다.">
 *   <CustomButton type="primary" onClick={handleCreate}>
 *     새로 등록
 *   </CustomButton>
 * </CustomEmpty>
 *
 * // 커스텀 이미지
 * <CustomEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} description="내역 없음" />
 *
 * // 조건부 렌더링 패턴
 * {dataSource.length === 0 ? <CustomEmpty description="데이터 없음" /> : <CustomTable ... />}
 */
import React from 'react';
import {Empty, EmptyProps} from 'antd';

interface CustomEmptyProps extends EmptyProps {}

const CustomEmpty = (props: CustomEmptyProps) => {
    return (
        <Empty {...props} />
    );
};

export default CustomEmpty;
