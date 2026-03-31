import React, {forwardRef, useEffect, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    rules?: any;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    displayFormatter?:(v:string)=>string;
    [key: string]: any;
}

const CustomSaveFormInput = forwardRef<any, CustomFormInputProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, regExp, displayFormatter, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field: any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && regExp.value && !regExp.value.test(v.target.value)) {
            setValidError(true);
            return;
        }
        if (v.target.value.length === 1) {
            field.onChange('');
        }
        field.onChange(v);
        onChangeValue && onChangeValue(v);
    };

    useEffect(() => {
        setValidError(false);
    }, [control._fields]);
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className={singleRow ? 'full' : props.isNoTitle === true ? 'no-title' : ''}>
                    {props.isNoTitle !== true && (
                        <span className="tit mt0">{props.title}{props.required ? <em>*</em> : null}</span>
                    )}
                    <div className="box-inp">
                        <Tooltip
                            title={validError && regExp?.message ? regExp.message : (fieldState.error?.message ?? (regExp ? regExp.message : ''))}
                            open={(fieldState.error !== undefined || validError) && focus}
                        >
                            <div className={(fieldState.error !== undefined || validError) ? 'tooltip error' : ''}>
                                <Input
                                    {...props}
                                    {...((!inputFocused && displayFormatter) ? {maxLength: undefined} : {})}
                                    ref={ref}
                                    id={field.name}
                                    name={field.name}
                                    value={(!inputFocused && displayFormatter) ? displayFormatter(field.value ?? '') : (field.value ?? '')}
                                    onChange={(v) => handleChange(field, v)}
                                    onBlur={(v) => {
                                        setInputFocused(false);
                                        if (!displayFormatter) {
                                            field.onChange(v);
                                            onChangeValue && onChangeValue(v.target.value);
                                        }
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => { setFocus(false); setValidError(false); }}
                                    onFocus={(e) => { setInputFocused(true); e.target.select(); }}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormInput.displayName = 'CustomSaveFormInput';

export default CustomSaveFormInput;