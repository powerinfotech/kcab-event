/**
 * CustomDescriptions / CustomDescriptionsItem - Ant Design Descriptions 래퍼 컴포넌트
 *
 * [목적]
 * 상세 조회 화면에서 키-값 쌍을 테이블 형태로 표시할 때 사용한다.
 *
 * [exports]
 * - default: CustomDescriptions     (Descriptions)
 * - named:   CustomDescriptionsItem (Descriptions.Item)
 *
 * [사용 방법]
 * @example
 * import CustomDescriptions, { CustomDescriptionsItem } from '@component/display/CustomDescriptions';
 *
 * <CustomDescriptions title="사용자 정보" bordered column={2}>
 *   <CustomDescriptionsItem label="사용자 ID">admin</CustomDescriptionsItem>
 *   <CustomDescriptionsItem label="이름">홍길동</CustomDescriptionsItem>
 *   <CustomDescriptionsItem label="이메일">hong@example.com</CustomDescriptionsItem>
 *   <CustomDescriptionsItem label="상태">활성</CustomDescriptionsItem>
 * </CustomDescriptions>
 */
import React from 'react';
import {Descriptions} from 'antd';
import type {DescriptionsProps} from 'antd';

interface CustomDescriptionsProps extends DescriptionsProps {}

const CustomDescriptions = (props: CustomDescriptionsProps) => {
    return (
        <Descriptions {...props} />
    );
};

export const CustomDescriptionsItem = Descriptions.Item;

export default CustomDescriptions;
