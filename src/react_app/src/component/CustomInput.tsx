import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';

interface CustomInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    [key: string]: any;
}

const CustomInput = forwardRef<any, CustomInputProps>((props, ref) => {
    const { regExp, ...restProps } = props;
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);
    const [internalValue, setInternalValue] = useState(props.value ?? '');
    const isComposingRef = useRef(false);

    useEffect(() => {
        if (!isComposingRef.current) {
            setInternalValue(props.value ?? '');
        }
    }, [props.value]);

    const handleChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && regExp.value && !regExp.value.test(v.target.value)) {
            setValidError(true);
            return;
        }
        setInternalValue(v.target.value);
        if (!isComposingRef.current) {
            props.onChange && props.onChange(v);
        }
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false;
        if (props.onChange) {
            props.onChange({
                target: e.target,
                currentTarget: e.currentTarget,
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <Tooltip title={validError && regExp?.message ? regExp.message : ''} open={validError && regExp?.message !== undefined}>
            <div className={validError && regExp?.message !== undefined ? 'tooltip error' : ''}>
                <Input
                    {...restProps}
                    ref={ref}
                    value={internalValue}
                    onChange={(v) => handleChange(v)}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
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