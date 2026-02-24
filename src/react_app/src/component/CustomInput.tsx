import React, {forwardRef, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';

interface CustomInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    [key: string]: any;
}

const CustomInput = forwardRef<any, CustomInputProps>((props, ref) => {
    const { regExp, ...restProps } = props;
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);
    const handleChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && !regExp?.value.test(v.target.value))
            setValidError(true);
        else
            props.onChange && props.onChange(v);
    };

    return (
        <Tooltip title={regExp ? regExp.message : ''} open={validError && regExp?.message !== undefined}>
            <div className={validError && regExp?.message !== undefined ? 'tooltip error' : ''}>
                <Input
                    {...restProps}
                    ref={ref}
                    onChange={(v) => handleChange(v)}
                    onMouseEnter={() => setFocus(true)}
                    onMouseLeave={() => { setFocus(false); setValidError(false); }}
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </Tooltip>
    );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;