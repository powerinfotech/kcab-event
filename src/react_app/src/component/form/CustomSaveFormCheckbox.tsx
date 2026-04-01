/**
 * CustomSaveFormCheckbox - react-hook-form 연동 체크박스 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 체크박스 + 유효성 툴팁을 한 번에 렌더링한다.
 * defaultValue를 지정하지 않으면 useForm의 defaultValues 설정을 따른다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 체크 상태 변경 시 boolean 값 전달 콜백
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormCheckbox from '@component/form/CustomSaveFormCheckbox';
 *
 * const { control } = useForm({ defaultValues: { agreeYn: false } });
 *
 * <CustomSaveFormCheckbox
 *   name="agreeYn"
 *   control={control}
 *   title="이용약관 동의"
 *   required
 *   onChangeValue={(checked) => console.log('동의 여부:', checked)}
 * />
 */
import React, {useState} from 'react';
import {Checkbox, CheckboxProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomCheckboxProps extends CheckboxProps {
    name:string;
    control:Control<any>;
    defaultValue?:boolean;
    onChangeValue?: (v:boolean) => void;
    [key: string]: any;
};

const CustomSaveFormCheckbox = ({name, control, defaultValue, onChangeValue,...props}:CustomCheckboxProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState }) => (
                <p>
                    <span className="tit mt0">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <Checkbox
                                    {...props}
                                    title={props.title}
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value}
                                    onChange={(v)=>{
                                        field.onChange(v);
                                        onChangeValue&&onChangeValue(v.target.checked);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                    />
                            </div>
                        </Tooltip>
                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormCheckbox;