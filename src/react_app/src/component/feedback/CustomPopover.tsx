import React from 'react';
import {Popover, PopoverProps} from 'antd';

interface CustomPopoverProps extends PopoverProps {}

const CustomPopover = (props: CustomPopoverProps) => {
    return (
        <Popover {...props} />
    );
};

export default CustomPopover;
