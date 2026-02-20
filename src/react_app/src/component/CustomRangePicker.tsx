import {RangePickerProps} from 'antd/es/date-picker';
import {DatePicker} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';

interface CustomRangePickerProps extends RangePickerProps {}

const {RangePicker} = DatePicker;

const CustomRangePicker = (props : CustomRangePickerProps) => {
    return (
        <>
            <RangePicker {...props} locale={locale} ></RangePicker>
        </>
    );
};

export default CustomRangePicker;