/**
 * CustomSelect - Ant Design Select 래퍼 컴포넌트
 *
 * [목적]
 * 단일 선택 셀렉트 박스를 표시할 때 사용한다.
 * react-hook-form 연동 시 CustomSaveFormSelect 또는 CustomValidFormSelect를 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomSelect from '@component/select/CustomSelect';
 *
 * const options = [
 *   { label: '전체', value: '' },
 *   { label: '활성', value: 'Y' },
 *   { label: '비활성', value: 'N' },
 * ];
 *
 * <CustomSelect
 *   options={options}
 *   value={status}
 *   onChange={setStatus}
 *   placeholder="상태 선택"
 *   style={{ width: 150 }}
 * />
 *
 * // 공통코드 연동
 * const { getOptions } = useCmCode('USER_STATUS');
 * <CustomSelect options={getOptions()} value={status} onChange={setStatus} />
 */
import React from 'react';
import {Select, SelectProps} from 'antd';

interface CustomSelectProps extends SelectProps {}

const CustomSelect = (props: CustomSelectProps) => {
    return (
        <Select {...props} />
    );
};

export default CustomSelect;