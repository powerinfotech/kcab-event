/**
 * CustomRangePicker - 한국어 로케일 적용 날짜 범위 선택 컴포넌트
 *
 * [목적]
 * Ant Design DatePicker.RangePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 시작·종료 날짜를 하나의 피커에서 선택할 때 사용한다.
 * 시작·종료를 개별 상태로 관리해야 한다면 CustomDateRangePicker를 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomRangePicker from '@component/date/CustomRangePicker';
 * import dayjs, { Dayjs } from 'dayjs';
 *
 * // 기본 날짜 범위 선택
 * <CustomRangePicker
 *   value={[startDate, endDate]}
 *   onChange={(dates) => {
 *     setStartDate(dates?.[0] ?? null);
 *     setEndDate(dates?.[1] ?? null);
 *   }}
 * />
 *
 * // 형식 지정
 * <CustomRangePicker format="YYYY-MM-DD" placeholder={['시작일', '종료일']} />
 *
 * // 오늘 이전 날짜 비활성화
 * <CustomRangePicker
 *   disabledDate={(current) => current && current < dayjs().startOf('day')}
 * />
 *
 * // 월 범위 선택
 * <CustomRangePicker picker="month" format="YYYY년 MM월" />
 */
import {RangePickerProps} from 'antd/es/date-picker';
import {DatePicker} from 'antd';
import locale from 'antd/locale/ko_KR';

interface CustomRangePickerProps extends RangePickerProps {}

const {RangePicker} = DatePicker;

const CustomRangePicker = (props: CustomRangePickerProps) => {
    const allowEmpty: [boolean, boolean] = props.disabled && !props.value ? [true, true] : [false, false];
    return (
        <RangePicker allowEmpty={allowEmpty} {...props} locale={locale} />
    );
};

export default CustomRangePicker;
