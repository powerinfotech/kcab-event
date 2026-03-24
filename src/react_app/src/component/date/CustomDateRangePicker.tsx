import {DatePickerProps} from 'antd';
import {Dayjs} from 'dayjs';
import CustomDatePicker from './CustomDatePicker';

interface CustomDateRangePickerProps {
    startPlaceholder?: string;
    endPlaceholder?: string;
    startValue?: Dayjs | null;
    endValue?: Dayjs | null;
    onChange?: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
    disabled?: boolean;
    startProps?: DatePickerProps;
    endProps?: DatePickerProps;
}

const CustomDateRangePicker = ({
    startPlaceholder = '시작일',
    endPlaceholder = '종료일',
    startValue,
    endValue,
    onChange,
    disabled,
    startProps,
    endProps,
}: CustomDateRangePickerProps) => {

    const handleStartChange = (date: Dayjs | null) => {
        onChange?.(date, endValue ?? null);
    };

    const handleEndChange = (date: Dayjs | null) => {
        onChange?.(startValue ?? null, date);
    };

    return (
        <div className="date-range-picker-wrap">
            <CustomDatePicker
                placeholder={startPlaceholder}
                value={startValue}
                onChange={handleStartChange}
                disabled={disabled}
                {...startProps}
            />
            <span>~</span>
            <CustomDatePicker
                placeholder={endPlaceholder}
                value={endValue}
                onChange={handleEndChange}
                disabled={disabled}
                {...endProps}
            />
        </div>
    );
};

export default CustomDateRangePicker;
