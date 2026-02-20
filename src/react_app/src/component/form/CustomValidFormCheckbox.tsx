import React, {useState} from 'react';
import {CheckboxProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import CustomCheckbox from '@component/CustomCheckbox';

interface CustomCheckboxProps extends CheckboxProps {
    name:string;
    control:Control<any>;
    onChangeValue?: (v:boolean) => void;
    [key: string]: any;
};

const CustomValidFormCheckbox = ({name, control, onChangeValue,...props}:CustomCheckboxProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <CustomCheckbox
                            {...props}
                            title={props.title}
                            id={field.name}
                            name={field.name}
                            checked={field.value}
                            onChange={(v)=>{
                                field.onChange(v);
                                onChangeValue&&onChangeValue(v.target.checked);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                            />
                    </div>
                </Tooltip>
            )}
        />
    );
};

export default CustomValidFormCheckbox;