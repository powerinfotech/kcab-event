import React from 'react';
import {Select, SelectProps} from 'antd';

interface CustomMultiSelectProps extends Omit<SelectProps, 'mode'> {}

const CustomMultiSelect = (props: CustomMultiSelectProps) => {
    return (
        <Select
            {...props}
            mode="multiple"
            showSearch
            filterOption={(input, option) =>
                String(option?.label ?? '').includes(input)
            }
        />
    );
};

export default CustomMultiSelect;
