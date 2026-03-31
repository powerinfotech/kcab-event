/**
 * CustomDropdown / CustomDropdownButton - Ant Design Dropdown 래퍼 컴포넌트
 *
 * [목적]
 * Ant Design Dropdown과 Dropdown.Button을 프로젝트 공통 컴포넌트로 래핑한다.
 *
 * [exports]
 * - default: CustomDropdown       (Dropdown)
 * - named:   CustomDropdownButton (Dropdown.Button)
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
import {Dropdown} from 'antd';
import type {DropdownProps, DropDownProps} from 'antd';
import type {DropdownButtonProps} from 'antd/es/dropdown';

interface CustomDropdownProps extends DropdownProps {}

const CustomDropdown = (props: CustomDropdownProps) => {
    return (
        <Dropdown {...props} />
    );
};

interface CustomDropdownButtonProps extends DropdownButtonProps {}

const CustomDropdownButton = (props: CustomDropdownButtonProps) => {
    return (
        <Dropdown.Button {...props} />
    );
};

export { CustomDropdownButton };
export default CustomDropdown;
