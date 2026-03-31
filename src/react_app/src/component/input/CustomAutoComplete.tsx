/**
 * CustomAutoComplete - 선택된 항목의 표시명(label)을 함께 보여주는 자동완성 컴포넌트
 *
 * [목적]
 * Ant Design AutoComplete를 래핑하여 showName 옵션으로 선택된 항목의 이름을 별도 Input으로 표시한다.
 * 코드를 선택하면 옆에 이름이 자동으로 표시되는 코드+이름 조합 입력 필드에 사용한다.
 *
 * @param showName - true일 때 label 값을 표시하는 읽기 전용 Input 추가 표시
 * @param label    - 표시할 이름 (외부에서 선택 이벤트 시 업데이트)
 *
 * [사용 방법]
 * @example
 * import CustomAutoComplete from '@component/input/CustomAutoComplete';
 *
 * // 기본 자동완성
 * <CustomAutoComplete
 *   options={options}
 *   value={code}
 *   onChange={setCode}
 *   placeholder="코드 입력"
 * />
 *
 * // 코드 + 이름 표시 (showName)
 * <CustomAutoComplete
 *   showName
 *   label={selectedName}
 *   options={options}
 *   value={code}
 *   onSelect={(value, option) => {
 *     setCode(value);
 *     setSelectedName(option.label);
 *   }}
 * />
 * // → [코드 입력창] [선택된 이름 표시창(읽기 전용)]
 *
 * // react-hook-form 연동 → CustomValidAutocomplete 또는 CustomSaveFormAutocomplete 사용 권장
 */
import React, {useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Input} from 'antd';

interface CustomAutocompleteProps extends AutoCompleteProps{
    showName?:boolean;
    size?:'small' | 'middle' | 'large' ;
    label?:string;
}
const CustomAutoComplete =  ({showName, label, children, ...restProps}:CustomAutocompleteProps) => {
        const [labelText, setLabelText] = useState<string>(label??'');


    useEffect(() => {
        setLabelText(label??'');
    }, [label]);

    return (
        <>
             <AutoComplete
                    {...restProps}
                    className={showName ? `${restProps.className || ''} autocomplete-mr`.trim() : restProps.className}
                >
                    {children}

                </AutoComplete>
            {showName&&<Input value={labelText} disabled={true} className="w200"/>}
        </>
    );
};

export default CustomAutoComplete;