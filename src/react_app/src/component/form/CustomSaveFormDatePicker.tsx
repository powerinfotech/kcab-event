import React, {useState} from 'react';
import {DatePicker, DatePickerProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import dayjs, {Dayjs} from 'dayjs';

interface CustomDatePickerProps extends DatePickerProps {
    name:string;
    defaultValue?:Dayjs;
    control:Control<any>;
    onChange?: (event: any) => void;
    onChangeValue?: (v:Dayjs) => void;
    [key: string]: any;
};

const CustomSaveFormDatePicker = ({name, control, onChange, onChangeValue,...props}:CustomDatePickerProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <DatePicker
                                    {...props}
                                    id={field.name}
                                    name={field.name}
                                    value={field.value ? dayjs(field.value) : undefined}
                                    onChange={(v) => {
                                        field.onChange(v?v.format('YYYY-MM-DD'):undefined);
                                        onChangeValue&&onChangeValue(v);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormDatePicker;