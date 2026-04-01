/**
 * CustomDropdown / CustomDropdownButton - Ant Design Dropdown 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design Dropdown과 Space.Compact + Button + Dropdown 조합을 프로젝트 공통 컴포넌트로 래핑한다.
 *
 * [exports]
 * - default: CustomDropdown       (Dropdown)
 * - named:   CustomDropdownButton (Space.Compact + Button + Dropdown)
 *
 * [사용 방법]
 * @example
 * import CustomDropdown, { CustomDropdownButton } from '@component/button/CustomDropdown';
 *
 * const items = [
 *   { key: '1', label: '메뉴 1' },
 *   { key: '2', label: '메뉴 2' },
 * ];
 *
 * // 드롭다운 트리거
 * <CustomDropdown menu={{ items }} trigger={['click']}>
 *   <CustomButton>메뉴 열기</CustomButton>
 * </CustomDropdown>
 *
 * // 버튼 + 드롭다운 분리형
 * <CustomDropdownButton menu={{ items }} type="primary" onClick={handleClick}>
 *   실행
 * </CustomDropdownButton>
 */
import React from 'react';
import {Button, Dropdown, Space} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import type {DropdownProps, ButtonProps} from 'antd';

interface CustomDropdownProps extends DropdownProps {}

const CustomDropdown = (props: CustomDropdownProps) => {
    return (
        <Dropdown {...props} />
    );
};

interface CustomDropdownButtonProps {
    menu: DropdownProps['menu'];
    type?: ButtonProps['type'];
    onClick?: ButtonProps['onClick'];
    children?: React.ReactNode;
    trigger?: DropdownProps['trigger'];
    placement?: DropdownProps['placement'];
    disabled?: boolean;
    loading?: ButtonProps['loading'];
    size?: ButtonProps['size'];
    icon?: React.ReactNode;
}

const CustomDropdownButton = (props: CustomDropdownButtonProps) => {
    const {menu, type, onClick, children, trigger, placement, disabled, loading, size, icon} = props;
    return (
        <Space.Compact>
            <Button type={type} onClick={onClick} disabled={disabled} loading={loading} size={size}>
                {children}
            </Button>
            <Dropdown menu={menu} trigger={trigger} placement={placement} disabled={disabled}>
                <Button type={type} disabled={disabled} size={size} icon={icon ?? <DownOutlined />} />
            </Dropdown>
        </Space.Compact>
    );
};

export {CustomDropdownButton};
export default CustomDropdown;
