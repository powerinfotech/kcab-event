import React, {useState} from 'react';
import {Radio, RadioProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomRadioProps extends RadioProps {
    name:string;
    control:Control<any>;
    defaultValue?:any;
    onChangeValue?: (v:string) => void;
    options?: {value:any, label:string }[];
    [key: string]: any;
};

const CustomSaveFormRadio = ({name, control, defaultValue, onChangeValue, options, ...props}:CustomRadioProps) => {
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
                        <Tooltip title={(field.value === undefined && fieldState.error?.message) ?fieldState.error?.message :  ''}
                                 open={field.value === undefined && fieldState.error !== undefined && focus}>
                            <div className={field.value === undefined && fieldState.error !== undefined ? 'tooltip error' : ''}>
                                  <Radio.Group
                                      {...props}
                                      id={field.name}
                                      name={field.name}
                                      value={field.value}
                                      onChange={(v)=>{
                                          field.onChange(v);
                                          onChangeValue&&onChangeValue(v.target.value);
                                      }}
                                      onBlur={(v)=>{
                                          field.onChange(v);
                                          // onChangeValue&&onChangeValue(v.target.value);
                                      }}
                                      onMouseEnter={() => setFocus(true)}
                                      onMouseLeave={() => setFocus(false)}
                                  >
                                      {options&&options.map((item)=> {
                                          return <Radio key={item.value} value={item.value}>{item.label}</Radio>;
                                      })}
                                </Radio.Group>
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormRadio;