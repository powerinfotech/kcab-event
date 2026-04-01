/**
 * CustomSaveFormMaskedInput - react-hook-form 연동 마스크 입력 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 마스크 입력 + 유효성 툴팁을 한 번에 렌더링한다.
 * 전화번호, 사업자등록번호 등 정해진 형식의 입력에 사용한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param maskType       - 마스크 유형 ('phone' | 'bizNo' | 'custom')
 * @param customMask     - maskType='custom'일 때 사용할 포맷 함수
 * @param onChangeValue  - 포맷된 값 변경 시 string 전달 콜백
 * @param singleRow      - true이면 'full' 클래스 적용 (전체 너비 단독 행)
 * @param isNoTitle      - true이면 제목 레이블 미표시
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시 (*) 아이콘
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormMaskedInput from '@component/form/CustomSaveFormMaskedInput';
 *
 * const { control } = useForm();
 *
 * // 전화번호 입력
 * <CustomSaveFormMaskedInput
 *   name="phone"
 *   control={control}
 *   title="전화번호"
 *   required
 *   maskType="phone"
 *   placeholder="010-0000-0000"
 *   rules={{ required: '전화번호를 입력해주세요.' }}
 * />
 *
 * // 사업자등록번호 입력
 * <CustomSaveFormMaskedInput
 *   name="bizNo"
 *   control={control}
 *   title="사업자등록번호"
 *   maskType="bizNo"
 *   placeholder="000-00-00000"
 * />
 *
 * // 커스텀 마스크 (우편번호)
 * <CustomSaveFormMaskedInput
 *   name="zipCode"
 *   control={control}
 *   title="우편번호"
 *   maskType="custom"
 *   customMask={(v) => v.replace(/\D/g, '').slice(0, 5)}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import CustomMaskedInput, {MaskType} from '@component/input/CustomMaskedInput';

interface CustomFormMaskedInputProps extends Omit<InputProps, 'onChange'> {
    name:string;
    defaultValue?:string;
    control:Control<any>;
    rules?: any;
    maskType: MaskType;
    customMask?: (value: string) => string;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    [key: string]: any;
}

const CustomSaveFormMaskedInput = forwardRef<any, CustomFormMaskedInputProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, maskType, customMask, ...props }, ref) => {
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
                                <CustomMaskedInput
                                    {...props}
                                    maskType={maskType}
                                    customMask={customMask}
                                    value={field.value ?? ''}
                                    onChange={(v) => {
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                    onFocus={(e) => (e.target as HTMLInputElement).select()}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormMaskedInput.displayName = 'CustomSaveFormMaskedInput';

export default CustomSaveFormMaskedInput;
