/**
 * CustomSpin - Ant Design Spin 래퍼 컴포넌트
 *
 * [목적]
 * 개별 영역의 로딩 상태를 표시할 때 사용한다.
 * 전체 화면 로딩은 CustomLoading(layout)을 사용하고,
 * 테이블, 카드, 섹션 등 특정 영역만 로딩 처리할 때 이 컴포넌트를 사용한다.
 *
 * [CustomLoading과의 차이]
 * - CustomLoading: 전역 오버레이 (Recoil loadingAtom 연동, 앱 최상단에 1회 배치)
 * - CustomSpin: 개별 영역 로딩 (컴포넌트 단위로 자유롭게 사용)
 *
 * [사용 방법]
 * @example
 * import CustomSpin from '@component/feedback/CustomSpin';
 *
 * // 영역 감싸기 (로딩 중이면 자식 위에 스피너 표시)
 * <CustomSpin spinning={isLoading}>
 *   <Table dataSource={data} columns={columns} />
 * </CustomSpin>
 *
 * // 팁 메시지 표시
 * <CustomSpin spinning={isLoading} description="데이터를 불러오는 중...">
 *   <div>콘텐츠 영역</div>
 * </CustomSpin>
 *
 * // 단독 스피너 (자식 없이)
 * {isLoading && <CustomSpin />}
 *
 * // 크기 조절
 * <CustomSpin spinning={isLoading} size="small">
 *   <Card>카드 내용</Card>
 * </CustomSpin>
 */
import React from 'react';
import {Spin, SpinProps} from 'antd';

interface CustomSpinProps extends SpinProps {}

const CustomSpin = (props: CustomSpinProps) => {
    return (
        <Spin {...props} />
    );
};

export default CustomSpin;
