/**
 * CustomValidFormSelect - react-hook-form 연동 셀렉트 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 셀렉트 + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormSelect와의 차이]
 * - 제목(tit) 레이블 없음
 * - nullFlag 없음
 * - 자유 레이아웃에 적합
 *
 * [주요 Props]
 * @param name              - react-hook-form 필드 이름
 * @param control           - useForm()의 control 객체
 * @param options           - 셀렉트 옵션 목록
 * @param onChangeValue - 선택 시 string 값 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormSelect from '@component/form/CustomValidFormSelect';
 *
 * const { control } = useForm();
 *
 * <CustomValidFormSelect
 *   name="status"
 *   control={control}
 *   options={statusOptions}
 *   onChangeValue={(v) => handleStatusChange(v)}
 *   style={{ width: 150 }}
 * />
 */
import React, {useState} from 'react';
import {SelectProps, Tooltip} from 'antd';
import {Control, Controller, FieldValues} from 'react-hook-form';
import CustomSelect from '@component/select/CustomSelect';

interface CustomFormSelectProps extends SelectProps {
    name:string;
    defaultValue?:string;
    control:Control<FieldValues>
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
};

const CustomValidFormSelect = ({name, defaultValue, control, onChangeValue, ...props}:CustomFormSelectProps) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <CustomSelect {...props}
                                      id={field.name}
                                      name={field.name}
                                      value={field.value}
                                      onChange={(v)=>{
                                        field.onChange(v);
                                        onChangeValue&&onChangeValue(v);
                                     }}
                                      onMouseEnter={() => setFocus(true)}
                                      onMouseLeave={() => setFocus(false)}
                                      options={props.options}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
};

export default CustomValidFormSelect;