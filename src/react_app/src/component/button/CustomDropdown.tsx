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
