import {DatePicker, DatePickerProps} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';

interface CustomDatePickerProps extends DatePickerProps  {
    [key: string]: any;
};

const CustomDatePicker = (props:CustomDatePickerProps) => {

    return (
        <>
            <DatePicker {...props} locale={locale} />
        </>
    );
};


export default CustomDatePicker;