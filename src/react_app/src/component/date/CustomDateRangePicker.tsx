/**
 * CustomDateRangePicker - 시작일/종료일 분리형 날짜 범위 선택 컴포넌트
 *
 * [목적]
 * 두 개의 CustomDatePicker를 "~" 구분자로 배치하여 날짜 범위를 입력받는다.
 * Ant Design RangePicker와 달리 시작/종료 값을 개별 상태로 관리할 수 있어
 * 각각 disabled, disabledDate 조건을 따로 적용하기 쉽다.
 *
 * @param startValue        - 시작일 Dayjs 값
 * @param endValue          - 종료일 Dayjs 값
 * @param onChange          - (startDate, endDate) 형태로 둘 다 전달
 * @param startPlaceholder  - 시작일 placeholder (기본: '시작일')
 * @param endPlaceholder    - 종료일 placeholder (기본: '종료일')
 * @param disabled          - 시작/종료 모두 비활성화
 * @param startProps        - 시작일 DatePicker에만 적용할 추가 props
 * @param endProps          - 종료일 DatePicker에만 적용할 추가 props
 *
 * [사용 방법]
 * @example
 * import CustomDateRangePicker from '@component/date/CustomDateRangePicker';
 * import dayjs, { Dayjs } from 'dayjs';
 *
 * const [startDate, setStartDate] = useState<Dayjs | null>(null);
 * const [endDate, setEndDate] = useState<Dayjs | null>(null);
 *
 * // 기본 사용
 * <CustomDateRangePicker
 *   startValue={startDate}
 *   endValue={endDate}
 *   onChange={(start, end) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 * />
 *
 * // 종료일은 시작일 이후만 선택 가능
 * <CustomDateRangePicker
 *   startValue={startDate}
 *   endValue={endDate}
 *   onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
 *   endProps={{
 *     disabledDate: (current) => !!startDate && current < startDate.startOf('day'),
 *   }}
 * />
 *
 * // 종료일만 비활성화
 * <CustomDateRangePicker
 *   startValue={startDate}
 *   endValue={endDate}
 *   onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
 *   endProps={{ disabled: true }}
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
    startProps?: DatePickerProps<Dayjs, false>;
    endProps?: DatePickerProps<Dayjs, false>;
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
