/**
 * CustomRangePicker - 한국어 로케일 적용 날짜 범위 선택 컴포넌트
 *
 * [목적]
 * Ant Design DatePicker.RangePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 시작/종료 날짜를 하나의 피커에서 선택할 때 사용한다.
 * 시작/종료를 개별 상태로 관리해야 한다면 CustomDateRangePicker를 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomRangePicker from '@component/date/CustomRangePicker';
 * import dayjs from 'dayjs';
 *
 * <CustomRangePicker
 *   value={[startDate, endDate]}
 *   onChange={([start, end]) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 *   format="YYYY-MM-DD"
 * />
 */
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