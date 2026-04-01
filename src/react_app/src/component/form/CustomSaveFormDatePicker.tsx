/**
 * CustomSaveFormDatePicker - react-hook-form 연동 날짜 선택 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 날짜 선택기 + 유효성 툴팁을 한 번에 렌더링한다.
 * 날짜 값은 내부적으로 'YYYY-MM-DD' 문자열로 저장된다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 날짜 변경 시 Dayjs 값 전달 콜백
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시
 *
 * [저장 형식]
 * - form 내부 값: 'YYYY-MM-DD' 문자열 (예: '2024-01-15')
 * - onChangeValue 콜백: Dayjs 객체 전달
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormDatePicker from '@component/form/CustomSaveFormDatePicker';
 *
 * const { control } = useForm({ defaultValues: { startDate: '2024-01-01' } });
 *
 * <CustomSaveFormDatePicker
 *   name="startDate"
 *   control={control}
 *   title="시작일"
 *   required
 *   onChangeValue={(dayjs) => console.log('선택된 날짜:', dayjs?.format('YYYY-MM-DD'))}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {DatePicker, DatePickerProps, Tooltip} from 'antd';
import {Control, Controller, FieldValues} from 'react-hook-form';
import dayjs, {Dayjs} from 'dayjs';

interface CustomDatePickerProps extends DatePickerProps {
    name:string;
    defaultValue?:Dayjs;
    control:Control<FieldValues>;
    onChange?: (event: any) => void;
    onChangeValue?: (v:Dayjs) => void;
    [key: string]: any;
};

const CustomSaveFormDatePicker = forwardRef<HTMLDivElement, CustomDatePickerProps>(
    ({name, control, onChange, onChangeValue,...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div ref={ref}>
                    <span className="tit">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
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
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormDatePicker.displayName = 'CustomSaveFormDatePicker';

export default CustomSaveFormDatePicker;