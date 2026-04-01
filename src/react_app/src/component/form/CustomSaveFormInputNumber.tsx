/**
 * CustomSaveFormInputNumber - react-hook-form 연동 숫자 입력 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + InputNumber + 유효성 툴팁을 한 번에 렌더링한다.
 * 최솟값/최댓값 제한, 증감 버튼, 형식 지정(천단위 구분자 등)을 지원한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param onChangeValue  - 값 변경 시 number|null 전달 콜백
 * @param singleRow      - true이면 'full' 클래스 적용 (전체 너비 단독 행)
 * @param isNoTitle      - true이면 제목 레이블 미표시
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시 (*) 아이콘
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormInputNumber from '@component/form/CustomSaveFormInputNumber';
 *
 * const { control } = useForm({ defaultValues: { quantity: 1 } });
 *
 * // 기본 숫자 입력
 * <CustomSaveFormInputNumber
 *   name="quantity"
 *   control={control}
 *   title="수량"
 *   required
 *   min={1}
 *   max={999}
 *   rules={{ required: '수량을 입력해주세요.' }}
 * />
 *
 * // 금액 입력 (천단위 구분자)
 * <CustomSaveFormInputNumber
 *   name="price"
 *   control={control}
 *   title="단가"
 *   singleRow
 *   formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v?.replace(/,/g, '') as any}
 * />
 *
 * // 소수점 입력
 * <CustomSaveFormInputNumber
 *   name="rate"
 *   control={control}
 *   title="비율"
 *   min={0}
 *   max={100}
 *   step={0.1}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {InputNumber, InputNumberProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputNumberProps extends InputNumberProps {
    name:string;
    defaultValue?:number;
    control:Control<any>;
    rules?: any;
    onChangeValue?:(v:number|null)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    [key: string]: any;
}

const CustomSaveFormInputNumber = forwardRef<any, CustomFormInputNumberProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className={singleRow ? 'full' : props.isNoTitle === true ? 'no-title' : ''}>
                    {props.isNoTitle !== true && (
                        <span className="tit mt0">{props.title}{props.required ? <em>*</em> : null}</span>
                    )}
                    <div className="box-inp">
                        <Tooltip
                            title={fieldState.error?.message ?? ''}
                            open={fieldState.error !== undefined && focus}
                        >
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
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormInputNumber.displayName = 'CustomSaveFormInputNumber';

export default CustomSaveFormInputNumber;
