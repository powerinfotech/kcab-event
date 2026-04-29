/**
 * CustomValidFormCheckbox - react-hook-form 연동 체크박스 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 체크박스 + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 체크 상태 변경 시 boolean 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormCheckbox from '@component/form/CustomValidFormCheckbox';
 *
 * const { control } = useForm();
 *
 * <CustomValidFormCheckbox
 *   name="isActive"
 *   control={control}
 *   onChangeValue={(checked) => handleActiveChange(checked)}
 * />
 */
import React, {useState} from 'react';
import {CheckboxProps, Tooltip} from 'antd';
import {Controller} from 'react-hook-form';
import CustomCheckbox from '@component/select/CustomCheckbox';

interface CustomCheckboxProps extends CheckboxProps {
    name:string;
    control:any;
    onChangeValue?: (v:boolean) => void;
    [key: string]: any;
};

const CustomValidFormCheckbox = ({name, control, onChangeValue,...props}:CustomCheckboxProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <CustomCheckbox
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
            )}
        />
    );
};

export default CustomValidFormCheckbox;