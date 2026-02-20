import React, {useState} from 'react';
import {Select, SelectProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormSelectProps extends SelectProps {
    name:string;
    defaultValue?:string;
    control:Control<any>
    onChangeValueback?:(v:any)=>void;
    nullFlag?:boolean;
    nullText?:string;
    [key: string]: any;
};

const CustomSaveFormSelect = ({name, defaultValue, control, onChangeValueback, ...props}:CustomFormSelectProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const options = props.nullFlag ? [{label:'', value:''}, ...(props.options ?? [])] : props.options;
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit" style={{ marginTop: '0px'}}>{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <Select {...props}
                                              id={field.name}
                                              value={field.value}
                                              onChange={(v,option)=>{
                                                field.onChange(v);
                                                onChangeValueback&&onChangeValueback(option);
                                             }}
                                              onMouseEnter={() => setFocus(true)}
                                              onMouseLeave={() => setFocus(false)}
                                              options={options}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />

    );
};

export default CustomSaveFormSelect;