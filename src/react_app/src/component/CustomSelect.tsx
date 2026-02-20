import React from 'react';
import {Select, SelectProps} from 'antd';

interface CustomSelectProps extends SelectProps{
    [key: string]: any;
}

const CustomSelect = (props: CustomSelectProps) => {
    return (
        <>
            <Select
                {...props}
            />
        </>
    );
};

export default CustomSelect;