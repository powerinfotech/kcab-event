/**
 * CustomSaveFormInput - react-hook-form 연동 텍스트 입력 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 입력 필드 + 유효성 툴팁을 한 번에 렌더링한다.
 * 저장 폼의 표준 레이아웃(tit 클래스 제목 + box-inp 입력 영역)을 자동 적용한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param regExp         - 정규식 검증 { value, message } — 실패 시 입력 차단 + 툴팁
 * @param onChangeValue  - 값 변경 시 외부 콜백 (string)
 * @param singleRow      - true이면 'full' 클래스 적용 (전체 너비 단독 행)
 * @param isNoTitle      - true이면 제목 레이블 미표시
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시 (*) 아이콘
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormInput from '@component/form/CustomSaveFormInput';
 * import { ALPHANUMERIC_REGEXP } from '@util/validationPatterns';
 *
 * const { control } = useForm();
 *
 * // 기본 입력 필드
 * <CustomSaveFormInput
 *   name="userName"
 *   control={control}
 *   title="사용자명"
 *   required
 *   rules={{ required: '사용자명을 입력해주세요.' }}
 * />
 *
 * // 정규식 + 전체 너비
 * <CustomSaveFormInput
 *   name="userId"
 *   control={control}
 *   title="사용자 ID"
 *   singleRow
 *   regExp={ALPHANUMERIC_REGEXP}
 * />
 *
 * // 제목 없음 (그리드 레이아웃에서 단독 셀)
 * <CustomSaveFormInput name="memo" control={control} isNoTitle />
 */
import React, {forwardRef, useEffect, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    rules?: any;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    displayFormatter?:(v:string)=>string;
    [key: string]: any;
}

const CustomSaveFormInput = forwardRef<any, CustomFormInputProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, regExp, displayFormatter, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field: any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && regExp.value && !regExp.value.test(v.target.value)) {
            setValidError(true);
            return;
        }
        if (v.target.value.length === 1) {
            field.onChange('');
        }
        field.onChange(v);
        onChangeValue && onChangeValue(v);
    };

    useEffect(() => {
        setValidError(false);
    }, [control._fields]);
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
                            title={validError && regExp?.message ? regExp.message : (fieldState.error?.message ?? (regExp ? regExp.message : ''))}
                            open={(fieldState.error !== undefined || validError) && focus}
                        >
                            <div className={(fieldState.error !== undefined || validError) ? 'tooltip error' : ''}>
                                <Input
                                    {...props}
                                    {...((!inputFocused && displayFormatter) ? {maxLength: undefined} : {})}
                                    ref={ref}
                                    id={field.name}
                                    name={field.name}
                                    value={(!inputFocused && displayFormatter) ? displayFormatter(field.value ?? '') : (field.value ?? '')}
                                    onChange={(v) => handleChange(field, v)}
                                    onBlur={() => {
                                        setInputFocused(false);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => { setFocus(false); setValidError(false); }}
                                    onFocus={(e) => { setInputFocused(true); e.target.select(); }}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormInput.displayName = 'CustomSaveFormInput';

export default CustomSaveFormInput;