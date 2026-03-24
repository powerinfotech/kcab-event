import React from 'react';
import {TimePicker, TimePickerProps} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';

interface CustomTimePickerProps extends TimePickerProps {}

const CustomTimePicker = (props: CustomTimePickerProps) => {
    return (
        <TimePicker locale={locale} {...props} />
    );
};

export default CustomTimePicker;
