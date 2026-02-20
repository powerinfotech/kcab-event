import React, {useState} from 'react';
import {SelectProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import CustomSelect from '@component/CustomSelect';

interface CustomFormSelectProps extends SelectProps {
    name:string;
    defaultValue?:string;
    control:Control<any>
    onChangeValueback?:(v:string)=>void;
    [key: string]: any;
};

const CustomValidFormSelect = ({name, defaultValue, control, onChangeValueback, ...props}:CustomFormSelectProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <CustomSelect {...props}
                                      id={field.name}
                                      name={field.name}
                                      value={field.value}
                                      onChange={(v)=>{
                                        field.onChange(v);
                                        onChangeValueback&&onChangeValueback(v);
                                     }}
                                      onMouseEnter={() => setFocus(true)}
                                      onMouseLeave={() => setFocus(false)}
                                      options={props.options}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
};

export default CustomValidFormSelect;