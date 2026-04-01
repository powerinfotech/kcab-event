/**
 * CustomTimeRangePicker - 한국어 로케일 적용 시간 범위 선택 컴포넌트
 *
 * [목적]
 * Ant Design TimePicker.RangePicker를 래핑하여 한국어(ko_KR) 로케일을 기본 적용한다.
 * 시작·종료 시간을 하나의 피커에서 선택할 때 사용한다.
 * 시작·종료를 개별 상태로 관리해야 한다면 CustomTimePicker 두 개를 직접 배치한다.
 *
 * [사용 방법]
 * @example
 * import CustomTimeRangePicker from '@component/date/CustomTimeRangePicker';
 *
 * // 기본 시간 범위 선택 (시:분)
 * <CustomTimeRangePicker
 *   value={[startTime, endTime]}
 *   onChange={(times) => {
 *     setStartTime(times?.[0] ?? null);
 *     setEndTime(times?.[1] ?? null);
 *   }}
 *   format="HH:mm"
 * />
 *
 * // placeholder 지정
 * <CustomTimeRangePicker
 *   format="HH:mm"
 *   placeholder={['시작 시간', '종료 시간']}
 * />
 *
 * // 30분 단위
 * <CustomTimeRangePicker format="HH:mm" minuteStep={30} />
 *
 * // 비활성화
 * <CustomTimeRangePicker disabled />
 */
import React from 'react';
import {TimePicker} from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import type {TimeRangePickerProps} from 'antd/es/time-picker';

interface CustomTimeRangePickerProps extends TimeRangePickerProps {}

const CustomTimeRangePicker = (props: CustomTimeRangePickerProps) => {
    return (
        <TimePicker.RangePicker locale={locale} {...props} />
    );
};

export default CustomTimeRangePicker;
