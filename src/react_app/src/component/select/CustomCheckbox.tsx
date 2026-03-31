/**
 * CustomCheckbox - Ant Design Checkbox 래퍼 컴포넌트
 *
 * [목적]
 * 단일 체크박스 또는 그룹 체크박스를 표시할 때 사용한다.
 * react-hook-form 연동 시 CustomSaveFormCheckbox 또는 CustomValidFormCheckbox를 사용한다.
 *
 * [사용 방법]
 * @example
 * // 단독 체크박스
 * <CustomCheckbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
 *   활성화
 * </CustomCheckbox>
 *
 * // 그룹 (Checkbox.Group 사용)
 * <Checkbox.Group options={['사과', '바나나', '포도']} value={selected} onChange={setSelected} />
 */
import React from 'react';
import {Checkbox, CheckboxProps} from 'antd';

interface CustomCheckboxProps extends CheckboxProps {
    [key: string]: any;
};
const CustomCheckbox = (props:CustomCheckboxProps) => {

    return (
       <Checkbox {...props} />
    )
    ;

};

export default CustomCheckbox;