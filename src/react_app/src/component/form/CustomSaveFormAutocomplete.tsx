/**
 * CustomSaveFormAutocomplete - react-hook-form 연동 자동완성 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + AutoComplete + 유효성 툴팁을 한 번에 렌더링한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시
 * @param options        - { label, value }[] 자동완성 후보 목록
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormAutocomplete from '@component/form/CustomSaveFormAutocomplete';
 *
 * const { control } = useForm();
 *
 * <CustomSaveFormAutocomplete
 *   name="email"
 *   control={control}
 *   title="이메일"
 *   required
 *   options={emailSuggestions}
 *   onChangeValue={(v) => setEmail(v)}
 * />
 */
import React, {useState} from 'react';
import {AutoComplete, AutoCompleteProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomAutoCompleteProps extends AutoCompleteProps {
    name:string;
    defaultValue?:string;
    control?:Control<any>;
    onChangeValue?:(v:string)=>void;
    size?:'small' | 'middle' | 'large' ;
    [key: string]: any;
}

const CustomValidAutoComplete = ({name, defaultValue, control, onChangeValue,  ...props}:CustomAutoCompleteProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <AutoComplete
                                    {...props}
                                    id={field.name}
                                    value={field.value}
                                    onChange={(v) => {
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                    options={props.options}
                                >
                                    {props.children}
                                </AutoComplete>
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />
    );
};

export default CustomValidAutoComplete;