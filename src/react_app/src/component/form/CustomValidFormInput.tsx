/**
 * CustomValidFormInput - react-hook-form 연동 텍스트 입력 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 입력 필드 + 툴팁만 렌더링한다.
 * CustomSaveFormInput이 제목+입력 레이아웃을 포함하는 반면,
 * 이 컴포넌트는 테이블 셀, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormInput과의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 * - forwardRef로 InputRef 전달 가능
 * - 주로 테이블 인라인 편집, 커스텀 레이아웃에 사용
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param regExp         - 정규식 검증 { value, message }
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormInput from '@component/form/CustomValidFormInput';
 *
 * const { control, register } = useForm();
 *
 * // 테이블 셀 인라인 편집
 * <CustomValidFormInput
 *   control={control}
 *   required
 *   maxLength={50}
 *   onChangeValue={(v) => updateCell(v)}
 *   {...register('cellField', { required: '필수 입력' })}
 * />
 *
 * // EditableFormCell 내부에서 자동으로 사용됨
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {Input, InputProps, InputRef, Tooltip} from 'antd';
import {Control, Controller, FieldValues} from 'react-hook-form';

interface CustomFormInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<FieldValues>;
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
}

const CustomValidFormInput = forwardRef<InputRef, CustomFormInputProps>(({name, defaultValue, control, onChangeValue, regExp, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field:any, v: React.ChangeEvent<HTMLInputElement>) => {
         setValidError(false);
         if(regExp && regExp.value && !regExp.value.test(v.target.value)){
            setValidError(true);
            return;
         }
         field.onChange(v);
         onChangeValue && onChangeValue(v.target.value);
    };


    useEffect(() => {
        setValidError(false);
    }, [control._fields]);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <>
                <Tooltip title={validError && regExp?.message ? regExp.message : (fieldState.error?.message ?? (regExp ? regExp.message : ''))}
                         open={(fieldState.error !== undefined || validError) && focus}>
                    <div className={(fieldState.error !== undefined || validError)  ? 'tooltip error' : ''}>
                        <Input
                            {...props}
                            ref={ref}
                            id={field.name}
                            name={field.name}
                            value={field.value ?? ''}
                                     onChange={(v)=>{
                                         // onChangeValue&&onChangeValue(v.target.value);
                                         handleChange(field, v);
                                     }}
                                     onBlur={(v)=>{
                                         field.onChange(v);
                                         onChangeValue&&onChangeValue(v.target.value);
                                     }}
                                     onMouseEnter={() => setFocus(true)}
                                     onMouseLeave={() => {setFocus(false);setValidError(false);}}
                                     onFocus={(e) => e.target.select()}
                        />
                    </div>
                </Tooltip>
                    </>
            )}
        />
    );
});

CustomValidFormInput.displayName = 'CustomValidFormInput';

export default CustomValidFormInput;