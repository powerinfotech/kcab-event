import React, {useEffect, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
}

const CustomValidFormInput = ({name, defaultValue, control, onChangeValue,  ...props}:CustomFormInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field:any, v: React.ChangeEvent<HTMLInputElement>) => {
         setValidError(false);

         if(v.target.value.length === 1) {
             field.onChange('');
         }

        if(props.regExp&&props.regExp.value&&!props.regExp?.value.test(v.target.value)){
            setValidError(true);
        }
        else {
            field.onChange(v);
            props.onChangeValue && props.onChangeValue(v);
        }
    };


    useEffect(() => {
        setValidError(false);
    }, [control._fields]);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <>
                <Tooltip title={fieldState.error?.message ?? (props.regExp ?props.regExp.message: '')}
                         open={(fieldState.error !== undefined || validError) && focus}>
                    <div className={(fieldState.error !== undefined || validError)  ? 'tooltip error' : ''}>
                        <Input
                            {...props}
                                     id={field.name}
                                     name={field.name}
                                     value={field.value}
                                     onChange={(v)=>{
                                         // onChangeValue&&onChangeValue(v.target.value);
                                         handleChange(field, v);
                                     }}
                                     onBlur={(v)=>{
                                         field.onChange(v);
                                         onChangeValue&&onChangeValue(v.target.value);
                                     }}
                                     onMouseEnter={() => setFocus(true)}
                                     onMouseLeave={() => {setFocus(false);setValidError(false);}}
                                     onFocus={(e) => e.target.select()}
                        />
                    </div>
                </Tooltip>
                    </>
            )}
        />
    );
};

export default CustomValidFormInput;