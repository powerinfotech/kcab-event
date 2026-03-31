/**
 * CustomDateRangePicker - 시작일/종료일 분리형 날짜 범위 선택 컴포넌트
 *
 * [목적]
 * 두 개의 CustomDatePicker를 "~" 구분자로 배치하여 날짜 범위를 입력받는다.
 * Ant Design RangePicker와 달리 시작/종료 값을 개별 상태로 관리할 수 있다.
 *
 * @param startValue   - 시작일 Dayjs 값
 * @param endValue     - 종료일 Dayjs 값
 * @param onChange     - (startDate, endDate) 형태로 둘 다 전달
 * @param startProps   - 시작일 DatePicker 추가 props
 * @param endProps     - 종료일 DatePicker 추가 props
 *
 * [사용 방법]
 * @example
 * import CustomDateRangePicker from '@component/date/CustomDateRangePicker';
 * import dayjs, { Dayjs } from 'dayjs';
 *
 * const [startDate, setStartDate] = useState<Dayjs | null>(null);
 * const [endDate, setEndDate] = useState<Dayjs | null>(null);
 *
 * <CustomDateRangePicker
 *   startValue={startDate}
 *   endValue={endDate}
 *   onChange={(start, end) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 * />
 */
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
