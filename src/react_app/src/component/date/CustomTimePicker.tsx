/**
 * CustomTimePicker - 한국어 로케일 적용 시간 선택 컴포넌트
 *
 * [목적]
 * Ant Design TimePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 시간(시·분·초) 단위 입력이 필요한 폼 필드에 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomTimePicker from '@component/date/CustomTimePicker';
 *
 * // 시:분 입력
 * <CustomTimePicker
 *   value={selectedTime}
 *   onChange={(time) => setSelectedTime(time)}
 *   format="HH:mm"
 * />
 *
 * // 시:분:초 입력
 * <CustomTimePicker format="HH:mm:ss" />
 *
 * // 30분 단위로 선택
 * <CustomTimePicker format="HH:mm" minuteStep={30} />
 *
 * // 오전/오후 12시간제
 * <CustomTimePicker use12Hours format="h:mm a" />
 *
 * // 특정 시간 범위 비활성화 (09:00 이전 선택 불가)
 * <CustomTimePicker
 *   disabledTime={() => ({
 *     disabledHours: () => Array.from({ length: 9 }, (_, i) => i),
 *   })}
 * />
 */
import React from 'react';
import {TimePicker, TimePickerProps} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';

interface CustomTimePickerProps extends TimePickerProps {}

const CustomTimePicker = (props: CustomTimePickerProps) => {
    return (
        <TimePicker locale={locale} needConfirm={false} {...props} />
    );
};

export default CustomTimePicker;
