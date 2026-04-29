/**
 * CustomValidFormPassword - react-hook-form 연동 비밀번호 입력 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 비밀번호 입력 + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormPassword와의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param regExp         - 비밀번호 정책 정규식 검증 { value, message }
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormPassword from '@component/form/CustomValidFormPassword';
 *
 * const { control } = useForm();
 *
 * <CustomValidFormPassword
 *   name="password"
 *   control={control}
 *   regExp={{
 *     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
 *     message: '영문, 숫자 포함 8자 이상'
 *   }}
 *   onChangeValue={(v) => console.log(v)}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Input, Tooltip} from 'antd';
import type {PasswordProps} from 'antd/es/input';
import {Controller} from 'react-hook-form';

interface CustomFormPasswordProps extends PasswordProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:any;
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
}

const CustomValidFormPassword = forwardRef<any, CustomFormPasswordProps>(({name, defaultValue, control, onChangeValue, regExp, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field: any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && regExp.value && !regExp.value.test(v.target.value)) {
            setValidError(true);
        }
        field.onChange(v);
        onChangeValue && onChangeValue(v.target.value);
    };

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip
                    title={validError && regExp?.message ? regExp.message : (fieldState.error?.message ?? '')}
                    open={(fieldState.error !== undefined || validError) && focus}
                >
                    <div className={(fieldState.error !== undefined || validError) ? 'tooltip error' : ''}>
                        <Input.Password
                            {...props}
                            ref={ref}
                            id={field.name}
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(v) => handleChange(field, v)}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => { setFocus(false); setValidError(false); }}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
});

CustomValidFormPassword.displayName = 'CustomValidFormPassword';

export default CustomValidFormPassword;
