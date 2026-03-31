/**
 * CustomFloatButton / CustomFloatButtonGroup - Ant Design FloatButton 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design FloatButton과 FloatButton.Group을 프로젝트 공통 컴포넌트로 래핑한다.
 * 화면 우하단 고정 버튼(맨 위로 이동, 고객센터 등) 구현에 사용한다.
 *
 * [exports]
 * - default: CustomFloatButton      (FloatButton)
 * - named:   CustomFloatButtonGroup (FloatButton.Group)
 *
 * [사용 방법]
 * @example
 * import CustomFloatButton, { CustomFloatButtonGroup } from '@component/button/CustomFloatButton';
 *
 * // 단독 플로팅 버튼 (맨 위로)
 * <CustomFloatButton.BackTop />
 *
 * // 그룹 플로팅 버튼
 * <CustomFloatButtonGroup trigger="click" icon={<PlusOutlined />}>
 *   <CustomFloatButton icon={<CommentOutlined />} tooltip="문의" />
 *   <CustomFloatButton icon={<SyncOutlined />} tooltip="새로고침" />
 * </CustomFloatButtonGroup>
 */
import React from 'react';
import {FloatButton} from 'antd';
import type {FloatButtonProps, FloatButtonGroupProps} from 'antd/es/float-button/interface';

interface CustomFloatButtonProps extends FloatButtonProps {}

const CustomFloatButton = (props: CustomFloatButtonProps) => {
    return (
        <FloatButton {...props} />
    );
};

interface CustomFloatButtonGroupProps extends FloatButtonGroupProps {}

const CustomFloatButtonGroup = (props: CustomFloatButtonGroupProps) => {
    return (
        <FloatButton.Group {...props} />
    );
};

export { CustomFloatButtonGroup };
export default CustomFloatButton;
