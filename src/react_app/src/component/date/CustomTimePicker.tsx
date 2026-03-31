/**
 * CustomTimePicker - 한국어 로케일 적용 시간 선택 컴포넌트
 *
 * [목적]
 * Ant Design TimePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 *
 * [사용 방법]
 * @example
 * import CustomTimePicker from '@component/date/CustomTimePicker';
 *
 * <CustomTimePicker
 *   value={selectedTime}
 *   onChange={(time) => setSelectedTime(time)}
 *   format="HH:mm"
 * />
 *
 * // 초 단위 포함
 * <CustomTimePicker format="HH:mm:ss" />
 */
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
