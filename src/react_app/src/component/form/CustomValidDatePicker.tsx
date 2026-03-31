/**
 * CustomValidDatePicker - react-hook-form 연동 날짜 선택 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 DatePicker + 툴팁만 렌더링한다.
 * 날짜 값은 내부적으로 'YYYY-MM-DD' 문자열로 저장된다.
 *
 * [CustomSaveFormDatePicker와의 차이]
 * - 제목(tit) 레이블 없음
 * - 자유 레이아웃에 적합
 * - forwardRef 없음
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 날짜 변경 시 Dayjs 값 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidDatePicker from '@component/form/CustomValidDatePicker';
 *
 * const { control } = useForm({ defaultValues: { birthDate: '1990-01-01' } });
 *
 * <CustomValidDatePicker
 *   name="birthDate"
 *   control={control}
 *   onChangeValue={(dayjs) => console.log(dayjs?.format('YYYY-MM-DD'))}
 * />
 */
import React, {useState} from 'react';
import {DatePicker, DatePickerProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import dayjs, {Dayjs} from 'dayjs';

interface CustomDatePickerProps extends DatePickerProps {
    name:string;
    defaultValue?:Dayjs;
    control:Control<any>;
    onChange?: (event: any) => void;
    onChangeValue?: (v:Dayjs) => void;
    [key: string]: any;
};

const CustomSaveFormDatePicker = ({name, control, onChange, onChangeValue,...props}:CustomDatePickerProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <DatePicker
                                    {...props}
                                    id={field.name}
                                    name={field.name}
                                    value={field.value ? dayjs(field.value) : undefined}
                                    onChange={(v) => {
                                        field.onChange(v?v.format('YYYY-MM-DD'):undefined);
                                        onChangeValue&&onChangeValue(v);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                />
                            </div>
                        </Tooltip>
            )}
        />
    );
};

export default CustomSaveFormDatePicker;