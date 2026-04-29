/**
 * CustomFloatButton / CustomFloatButtonGroup / CustomFloatButtonBackTop
 * - Ant Design FloatButton 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design FloatButton, FloatButton.Group, FloatButton.BackTop을
 * 프로젝트 공통 컴포넌트로 래핑한다.
 * 화면 우하단 고정 버튼(맨 위로 이동, 고객센터 등) 구현에 사용한다.
 *
 * [exports]
 * - default: CustomFloatButton          (FloatButton)
 * - named:   CustomFloatButtonGroup     (FloatButton.Group)
 * - named:   CustomFloatButtonBackTop   (FloatButton.BackTop)
 *
 * [사용 방법]
 * @example
 * import CustomFloatButton, {
 *   CustomFloatButtonGroup,
 *   CustomFloatButtonBackTop,
 * } from '@component/button/CustomFloatButton';
 *
 * // 맨 위로 이동 버튼
 * <CustomFloatButtonBackTop />
 *
 * // 단독 플로팅 버튼
 * <CustomFloatButton icon={<QuestionCircleOutlined />} tooltip="도움말" />
 *
 * // 그룹 플로팅 버튼
 * <CustomFloatButtonGroup trigger="click" icon={<PlusOutlined />}>
 *   <CustomFloatButton icon={<CommentOutlined />} tooltip="문의" />
 *   <CustomFloatButton icon={<SyncOutlined />} tooltip="새로고침" />
 * </CustomFloatButtonGroup>
 */
import React from 'react';
import {FloatButton} from 'antd';
import type {FloatButtonProps} from 'antd/es/float-button/FloatButton';
import type {FloatButtonGroupProps} from 'antd/es/float-button/FloatButtonGroup';
import type {BackTopProps} from 'antd/es/float-button/BackTop';

interface CustomFloatButtonProps extends FloatButtonProps {}

const CustomFloatButton = (props: CustomFloatButtonProps) => {
    return (
        <FloatButton {...props} />
    );
};

interface CustomFloatButtonGroupProps extends Omit<FloatButtonGroupProps, 'children'> {
    children?: React.ReactNode;
}

const CustomFloatButtonGroup = (props: CustomFloatButtonGroupProps) => {
    return (
        <FloatButton.Group {...props}>{props.children}</FloatButton.Group>
    );
};

interface CustomFloatButtonBackTopProps extends BackTopProps {}

const CustomFloatButtonBackTop = (props: CustomFloatButtonBackTopProps) => {
    return (
        <FloatButton.BackTop {...props} />
    );
};

export { CustomFloatButtonGroup, CustomFloatButtonBackTop };
export default CustomFloatButton;
