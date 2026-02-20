import React, {useState} from 'react';
import {Checkbox, CheckboxProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomCheckboxProps extends CheckboxProps {
    name:string;
    control:Control<any>;
    onChangeValue?: (v:boolean) => void;
    [key: string]: any;
};

const CustomSaveFormCheckbox = ({name, control, onChangeValue,...props}:CustomCheckboxProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={true}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit" style={{ marginTop: '0px'}}>{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <Checkbox
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
                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormCheckbox;