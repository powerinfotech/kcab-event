import React, {useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';

interface CustomInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    [key: string]: any;
};

const CustomInput = (props:CustomInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);
    const handleChange = (v: React.ChangeEvent<HTMLInputElement>) => {
         setValidError(false);
        if(props.regExp&&!props.regExp?.value.test(v.target.value))
            setValidError(true);
        else
            props.onChange && props.onChange(v);
    };

    return (
        <Tooltip title={props.regExp ?props.regExp.message: ''} open={validError && props.regExp?.message!==undefined}>
            <div className={validError && props.regExp?.message!==undefined ? 'tooltip error' : ''}>
                <Input {...props}
                       onChange={(v) => handleChange(v)}
                       onMouseEnter={() => setFocus(true)}
                       onMouseLeave={() => {setFocus(false);setValidError(false);}}
                       onFocus={(e) => e.target.select()}/>
            </div>
        </Tooltip>
);
};

export default CustomInput;