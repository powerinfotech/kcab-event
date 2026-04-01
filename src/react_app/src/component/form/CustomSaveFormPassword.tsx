/**
 * CustomSaveFormPassword - react-hook-form 연동 비밀번호 입력 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 비밀번호 입력 + 유효성 툴팁을 한 번에 렌더링한다.
 * 눈 모양 아이콘으로 비밀번호 표시/숨김 전환이 기본 제공된다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param regExp         - 비밀번호 정책 정규식 검증 { value, message }
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 * @param singleRow      - true이면 'full' 클래스 적용 (전체 너비 단독 행)
 * @param isNoTitle      - true이면 제목 레이블 미표시
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시 (*) 아이콘
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormPassword from '@component/form/CustomSaveFormPassword';
 *
 * const { control } = useForm();
 *
 * // 기본 비밀번호 입력
 * <CustomSaveFormPassword
 *   name="password"
 *   control={control}
 *   title="비밀번호"
 *   required
 *   rules={{ required: '비밀번호를 입력해주세요.' }}
 * />
 *
 * // 비밀번호 정책 검증 (영문+숫자+특수문자 8자 이상)
 * <CustomSaveFormPassword
 *   name="newPassword"
 *   control={control}
 *   title="새 비밀번호"
 *   required
 *   regExp={{
 *     value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
 *     message: '영문, 숫자, 특수문자 포함 8자 이상'
 *   }}
 * />
 *
 * // 비밀번호 확인 (표시/숨김 토글 없음)
 * <CustomSaveFormPassword
 *   name="confirmPassword"
 *   control={control}
 *   title="비밀번호 확인"
 *   visibilityToggle={false}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Input, Tooltip} from 'antd';
import type {PasswordProps} from 'antd/es/input';
import {Control, Controller} from 'react-hook-form';

interface CustomFormPasswordProps extends PasswordProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    rules?: any;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    [key: string]: any;
}

const CustomSaveFormPassword = forwardRef<any, CustomFormPasswordProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, regExp, ...props }, ref) => {
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
            rules={rules}
            render={({ field, fieldState }) => (
                <div className={singleRow ? 'full' : props.isNoTitle === true ? 'no-title' : ''}>
                    {props.isNoTitle !== true && (
                        <span className="tit mt0">{props.title}{props.required ? <em>*</em> : null}</span>
                    )}
                    <div className="box-inp">
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
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormPassword.displayName = 'CustomSaveFormPassword';

export default CustomSaveFormPassword;
