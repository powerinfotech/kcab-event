/**
 * CustomMultiSelect - 다중 선택 + 검색 가능한 셀렉트 컴포넌트
 *
 * [목적]
 * mode="multiple"과 showSearch를 기본 적용한 셀렉트 컴포넌트다.
 * 단일 선택이 필요한 경우 CustomSelect를 사용한다.
 *
 * [특징]
 * - mode="multiple" 고정 (omit으로 외부에서 변경 불가)
 * - showSearch=true 고정
 * - filterOption: label 기준 부분 일치 검색
 *
 * [사용 방법]
 * @example
 * import CustomMultiSelect from '@component/select/CustomMultiSelect';
 *
 * const options = [
 *   { label: '관리자', value: 'ADMIN' },
 *   { label: '일반 사용자', value: 'USER' },
 *   { label: '뷰어', value: 'VIEWER' },
 * ];
 *
 * <CustomMultiSelect
 *   options={options}
 *   value={selectedRoles}
 *   onChange={setSelectedRoles}
 *   placeholder="권한 선택"
 *   style={{ width: 300 }}
 * />
 */
import React from 'react';
import {Select, SelectProps} from 'antd';

interface CustomMultiSelectProps extends Omit<SelectProps, 'mode'> {}

const CustomMultiSelect = (props: CustomMultiSelectProps) => {
    return (
        <Select
            {...props}
            mode="multiple"
            showSearch
            filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
        />
    );
};

export default CustomMultiSelect;
