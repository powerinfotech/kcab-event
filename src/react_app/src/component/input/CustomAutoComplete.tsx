/**
 * CustomAutoComplete - 선택된 항목의 표시명(label)을 함께 보여주는 자동완성 컴포넌트
 *
 * [목적]
 * Ant Design AutoComplete를 래핑하여 showName 옵션으로 선택된 항목의 이름을 별도 Input으로 표시한다.
 * 코드를 선택하면 옆에 이름이 자동으로 표시되는 코드+이름 조합 입력 필드에 사용한다.
 *
 * @param showName - true일 때 label 값을 표시하는 읽기 전용 Input 추가 표시
 * @param label    - 표시할 이름 (외부에서 onSelect 시 업데이트)
 *
 * [label 동기화 규칙]
 * - 항목 선택 시: 부모가 onSelect에서 label prop 업데이트 → labelText 자동 반영
 * - 값 직접 입력/수정 시: onChange가 호출되며 labelText를 '' 초기화
 *   → 선택한 항목과 입력값이 달라졌음을 표시명 초기화로 알림
 * - allowClear(X 버튼) 클릭 시: onChange('') → labelText 자동 초기화
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
 * const [code, setCode] = useState('');
 * const [name, setName] = useState('');
 *
 * <CustomAutoComplete
 *   showName
 *   label={name}
 *   options={options}
 *   value={code}
 *   onChange={(v) => { setCode(v); setName(''); }}   // 직접 입력 시 이름 초기화
 *   onSelect={(value, option) => {
 *     setCode(value);
 *     setName(option.label as string);               // 선택 시 이름 설정
 *   }}
 * />
 * // → [코드 입력창] [선택된 이름 표시창(읽기 전용)]
 *
 * // react-hook-form 연동 → CustomValidAutocomplete 또는 CustomSaveFormAutocomplete 사용 권장
 */
import React, { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteProps, Input } from 'antd';

interface CustomAutocompleteProps extends AutoCompleteProps {
    showName?: boolean;
    size?: 'small' | 'middle' | 'large';
    /** showName=true일 때 표시할 이름 텍스트 */
    label?: string;
}

const CustomAutoComplete = ({ showName, label, onChange, children, ...restProps }: CustomAutocompleteProps) => {
    /** 표시명 내부 상태 - label prop 또는 onChange 시 초기화로 관리 */
    const [labelText, setLabelText] = useState<string>(label ?? '');

    // 외부 label 변경 시 동기화 (onSelect에서 부모가 label 업데이트 시)
    useEffect(() => {
        setLabelText(label ?? '');
    }, [label]);

    /**
     * 값 변경 핸들러
     * 사용자가 직접 텍스트를 입력하거나 allowClear로 값을 지우면 labelText 초기화
     * → 선택된 항목과 입력값이 달라졌음을 명시적으로 표시
     */
    const handleChange = (value: string, option: any) => {
        // 값이 직접 변경(입력/삭제)되면 표시명 초기화
        if (showName) {
            setLabelText('');
        }
        onChange?.(value, option);
    };

    return (
        <>
            <AutoComplete
                {...restProps}
                onChange={handleChange}
                className={showName ? `${restProps.className || ''} autocomplete-mr`.trim() : restProps.className}
            >
                {children}
            </AutoComplete>
            {showName && <Input value={labelText} disabled className="w200" />}
        </>
    );
};

export default CustomAutoComplete;
