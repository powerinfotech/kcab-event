import React from 'react';
import {Checkbox, CheckboxProps} from 'antd';

interface CustomCheckboxProps extends CheckboxProps {
    [key: string]: any;
};
const CustomCheckbox = (props:CustomCheckboxProps) => {

    return (
       <Checkbox {...props} />
    )
    ;

};

export default CustomCheckbox;