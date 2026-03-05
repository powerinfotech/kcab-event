import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Input, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomValidAutoCompleteProps extends AutoCompleteProps {
    name:string;
    defaultValue?:string;
    control?:Control<any>;
    onChangeValue?:(v:string)=>void;
    showName?:boolean;
    size?:'small' | 'middle' | 'large' ;
    label?:string;
    [key: string]: any;
}

const CustomValidAutoComplete = ({name, defaultValue, control, onChangeValue, label,   ...props}:CustomValidAutoCompleteProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [labelText, setLabelText] = useState<string>(label??'');


    useEffect(() => {
        setLabelText(label??'');
    }, [label]);


    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                        <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <AutoComplete
                            {...props}
                            id={field.name}
                            value={field.value}
                            showSearch={false}
                            onChange={(v)=>{
                                field.onChange(v);
                                onChangeValue&&onChangeValue(v);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                            onSelect={(value, option) => {props.onSelect&&props.onSelect(value, option);}}
                            options={props.options}
                        >
                            {props.children}
                        </AutoComplete>
                        {props.showName&&<Input value={labelText} disabled={true} className="w200"/>}
                    </div>
                </Tooltip>

            )}
        />
    );
};

export default CustomValidAutoComplete;