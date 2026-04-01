/**
 * CustomValidFormInputNumber - react-hook-form 연동 숫자 입력 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 InputNumber + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormInputNumber와의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 값 변경 시 number|null 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormInputNumber from '@component/form/CustomValidFormInputNumber';
 *
 * const { control } = useForm();
 *
 * // 테이블 셀 숫자 편집
 * <CustomValidFormInputNumber
 *   name="qty"
 *   control={control}
 *   min={0}
 *   max={9999}
 *   onChangeValue={(v) => updateQty(v)}
 * />
 *
 * // 금액 입력 (천단위 구분자)
 * <CustomValidFormInputNumber
 *   name="amount"
 *   control={control}
 *   formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v?.replace(/,/g, '') as any}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {InputNumber, InputNumberProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputNumberProps extends InputNumberProps {
    name:string;
    defaultValue?:number;
    control:Control<any>;
    onChangeValue?:(v:number|null)=>void;
    [key: string]: any;
}

const CustomValidFormInputNumber = forwardRef<any, CustomFormInputNumberProps>(({name, defaultValue, control, onChangeValue, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <InputNumber
                            {...props}
                            ref={ref}
                            id={field.name}
                            value={field.value}
                            onChange={(v) => {
                                field.onChange(v);
                                onChangeValue && onChangeValue(v);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
});

CustomValidFormInputNumber.displayName = 'CustomValidFormInputNumber';

export default CustomValidFormInputNumber;
