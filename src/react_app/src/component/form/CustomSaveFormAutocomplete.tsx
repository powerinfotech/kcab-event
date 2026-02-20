import React, {useState} from 'react';
import {AutoComplete, AutoCompleteProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomAutoCompleteProps extends AutoCompleteProps {
    name:string;
    defaultValue?:string;
    control?:Control<any>;
    onChangeValue?:(v:string)=>void;
    size?:'small' | 'middle' | 'large' ;
    [key: string]: any;
}

const CustomValidAutoComplete = ({name, defaultValue, control, onChangeValue,  ...props}:CustomAutoCompleteProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <AutoComplete
                                    {...props}
                                    id={field.name}
                                    value={field.value}
                                    onChange={(v) => {
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                    options={props.options}
                                >
                                    {props.children}
                                </AutoComplete>
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />
    );
};

export default CustomValidAutoComplete;