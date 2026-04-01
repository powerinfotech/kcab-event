/**
 * CustomDatePicker - 한국어 로케일 적용 날짜 선택 컴포넌트
 *
 * [목적]
 * Ant Design DatePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 달력의 요일·월 표시가 한국어로 나오며, picker prop으로 연·월·주·분기 선택도 지원한다.
 *
 * [사용 방법]
 * @example
 * import CustomDatePicker from '@component/date/CustomDatePicker';
 * import dayjs from 'dayjs';
 *
 * // 기본 날짜 선택
 * <CustomDatePicker
 *   value={selectedDate}
 *   onChange={(date) => setSelectedDate(date)}
 *   placeholder="날짜 선택"
 * />
 *
 * // 형식 지정
 * <CustomDatePicker format="YYYY년 MM월 DD일" />
 *
 * // 월 선택
 * <CustomDatePicker picker="month" placeholder="월 선택" format="YYYY년 MM월" />
 *
 * // 연도 선택
 * <CustomDatePicker picker="year" placeholder="연도 선택" />
 *
 * // 특정 날짜 이전 비활성화 (오늘 이전 선택 불가)
 * <CustomDatePicker
 *   disabledDate={(current) => current && current < dayjs().startOf('day')}
 * />
 *
 * // react-hook-form과 함께 사용 시 → CustomSaveFormDatePicker / CustomValidDatePicker 사용 권장
 */
import {DatePicker, DatePickerProps} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';

interface CustomDatePickerProps extends DatePickerProps {}

const CustomDatePicker = (props: CustomDatePickerProps) => {
    return (
        <DatePicker {...props} locale={locale} />
    );
};

export default CustomDatePicker;
