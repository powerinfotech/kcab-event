import React from 'react';
import {Radio, RadioGroupProps} from 'antd';

interface CustomRadioGroupProps extends RadioGroupProps {
    options?: {value: any; label: string}[];
}

const CustomRadioGroup = ({options, children, ...restProps}: CustomRadioGroupProps) => {
    return (
        <Radio.Group {...restProps}>
            {options
                ? options.map((item) => (
                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                ))
                : children
            }
        </Radio.Group>
    );
};

export default CustomRadioGroup;
