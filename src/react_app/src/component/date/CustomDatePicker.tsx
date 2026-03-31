/**
 * CustomDatePicker - 한국어 로케일 적용 날짜 선택 컴포넌트
 *
 * [목적]
 * Ant Design DatePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 달력에서 요일·월 표시가 한국어로 나온다.
 *
 * [사용 방법]
 * @example
 * import CustomDatePicker from '@component/date/CustomDatePicker';
 * import dayjs from 'dayjs';
 *
 * // 기본 사용
 * <CustomDatePicker value={selectedDate} onChange={(date) => setSelectedDate(date)} />
 *
 * // 형식 지정
 * <CustomDatePicker format="YYYY-MM-DD" placeholder="날짜 선택" />
 *
 * // react-hook-form과 함께 사용 시 → CustomSaveFormDatePicker 또는 CustomValidDatePicker 사용 권장
 */
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