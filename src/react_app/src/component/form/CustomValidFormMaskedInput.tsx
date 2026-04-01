/**
 * CustomValidFormMaskedInput - react-hook-form 연동 마스크 입력 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 마스크 입력 + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormMaskedInput과의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param maskType       - 마스크 유형 ('phone' | 'bizNo' | 'custom')
 * @param customMask     - maskType='custom'일 때 사용할 포맷 함수
 * @param onChangeValue  - 포맷된 값 변경 시 string 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormMaskedInput from '@component/form/CustomValidFormMaskedInput';
 *
 * const { control } = useForm();
 *
 * // 테이블 셀 전화번호 편집
 * <CustomValidFormMaskedInput
 *   name="phone"
 *   control={control}
 *   maskType="phone"
 *   onChangeValue={(v) => updatePhone(v)}
 * />
 *
 * // 사업자등록번호
 * <CustomValidFormMaskedInput
 *   name="bizNo"
 *   control={control}
 *   maskType="bizNo"
 *   placeholder="000-00-00000"
 * />
 */
import React, {useState} from 'react';
import {InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import CustomMaskedInput, {MaskType} from '@component/input/CustomMaskedInput';

interface CustomFormMaskedInputProps extends Omit<InputProps, 'onChange'> {
    name:string;
    defaultValue?:string;
    control:Control<any>;
    maskType: MaskType;
    customMask?: (value: string) => string;
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
}

const CustomValidFormMaskedInput = ({name, defaultValue, control, onChangeValue, maskType, customMask, ...props}:CustomFormMaskedInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
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
            )}
        />
    );
};

export default CustomValidFormMaskedInput;
