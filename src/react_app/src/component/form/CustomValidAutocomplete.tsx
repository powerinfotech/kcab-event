/**
 * CustomValidAutocomplete - react-hook-form 연동 자동완성 컴포넌트 (인라인 유효성 + 이름 표시)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 AutoComplete + 유효성 툴팁을 렌더링한다.
 * showName 옵션으로 선택된 항목의 이름(label)을 읽기 전용 Input으로 표시할 수 있다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 * @param showName       - true이면 label 표시 읽기 전용 Input 추가
 * @param label          - 표시할 이름 (외부에서 선택 시 업데이트)
 *
 * [사용 방법]
 * @example
 * import CustomValidAutocomplete from '@component/form/CustomValidAutocomplete';
 *
 * const { control } = useForm();
 *
 * // 코드 입력 + 이름 표시
 * <CustomValidAutocomplete
 *   name="deptCode"
 *   control={control}
 *   showName
 *   label={selectedDeptName}
 *   options={deptOptions}
 *   onSelect={(value, option) => setSelectedDeptName(option.label)}
 * />
 * // → [코드 입력] [선택된 부서명 표시(읽기 전용)]
 */
import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Input, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomValidAutoCompleteProps extends AutoCompleteProps {
    name:string;
    defaultValue?:string;
    control?:Control<any>;
    onChangeValue?:(v:string)=>void;
    showName?:boolean;
    size?:'small' | 'middle' | 'large' ;
    label?:string;
    [key: string]: any;
}

const CustomValidAutoComplete = ({name, defaultValue, control, onChangeValue, label,   ...props}:CustomValidAutoCompleteProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [labelText, setLabelText] = useState<string>(label??'');


    useEffect(() => {
        setLabelText(label??'');
    }, [label]);


    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                        <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <AutoComplete
                            {...props}
                            id={field.name}
                            value={field.value}
                            showSearch={false}
                            onChange={(v)=>{
                                field.onChange(v);
                                onChangeValue&&onChangeValue(v);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                            onSelect={(value, option) => {props.onSelect&&props.onSelect(value, option);}}
                            options={props.options}
                        >
                            {props.children}
                        </AutoComplete>
                        {props.showName&&<Input value={labelText} disabled={true} className="w200"/>}
                    </div>
                </Tooltip>

            )}
        />
    );
};

export default CustomValidAutoComplete;