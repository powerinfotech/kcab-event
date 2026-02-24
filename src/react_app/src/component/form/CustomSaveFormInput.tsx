import React, {forwardRef, useEffect, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    [key: string]: any;
}

const CustomSaveFormInput = forwardRef<any, CustomFormInputProps>(({ name, defaultValue, control, onChangeValue, singleRow = false, regExp, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field: any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (v.target.value.length === 1) {
            field.onChange('');
        }

        if (regExp && regExp.value && !regExp?.value.test(v.target.value)) {
            setValidError(true);
        } else {
            field.onChange(v);
            onChangeValue && onChangeValue(v);
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
                <div className={singleRow ? 'full' : props.isNoTitle === true ? 'no-title' : ''}>
                    {props.isNoTitle !== true && (
                        <span className="tit" style={{ marginTop: '0px' }}>{props.title}{props.required ? <em>*</em> : null}</span>
                    )}
                    <div className="box-inp">
                        <Tooltip
                            title={fieldState.error?.message ?? (regExp ? regExp.message : '')}
                            open={(fieldState.error !== undefined || validError) && focus}
                        >
                            <div className={(fieldState.error !== undefined || validError) ? 'tooltip error' : ''}>
                                <Input
                                    {...props}
                                    ref={ref}
                                    id={field.name}
                                    name={field.name}
                                    value={field.value}
                                    onChange={(v) => handleChange(field, v)}
                                    onBlur={(v) => {
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v.target.value);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => { setFocus(false); setValidError(false); }}
                                    onFocus={(e) => e.target.select()}
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