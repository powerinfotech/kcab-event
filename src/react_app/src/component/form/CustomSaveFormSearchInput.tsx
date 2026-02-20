import React, {useEffect, useState} from 'react';
import {Button, Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import {SearchOutlined} from "@ant-design/icons";
import IconBtnSearch from "@icon/IconBtnSearch";

interface CustomFormSearchInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    onlyUseButtonFlag?: boolean;
    disabledButton?: boolean;
    onClickSearchBtn?: () => void;
    [key: string]: any;
}

const CustomSaveFormSearchInput = ({name, defaultValue, control, onChangeValue, singleRow=false, ...props}:CustomFormSearchInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field:any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if(v.target.value.length === 1) {
            field.onChange('');
        }

        if(props.regExp && props.regExp.value && !props.regExp?.value.test(v.target.value)){
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
                <p className={singleRow ?'full': props.isNoTitle === true ? 'no-title' : ''}>
                    { props.isNoTitle === true ? <></> : <span className="tit" style={{ marginTop: '0px'}}>{props.title}{props.required? <em>*</em> : <></>}</span>}
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? (props.regExp ?props.regExp.message: '')}
                                 open={(fieldState.error !== undefined || validError) && focus}>
                            <div className={(fieldState.error !== undefined || validError)  ? 'tooltip error' : ''}>
                                <Input.Search {...props}
                                    readOnly={props.onlyUseButtonFlag === true}
                                    enterButton={
                                        props.onlyUseButtonFlag === true ?
                                            <Button type="primary" onClick={props.onClickSearchBtn} disabled={props.disabledButton}>
                                                <IconBtnSearch/>
                                            </Button>
                                            :
                                            undefined
                                    }
                                    id={field.name}
                                    name={field.name}
                                    value={field.value}
                                    onChange={(v)=>{
                                        handleChange(field, v);
                                    }}
                                    onBlur={(v)=>{
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v.target.value);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => {setFocus(false);setValidError(false);}}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        </Tooltip>

                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormSearchInput;