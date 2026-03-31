/**
 * CustomRadioGroup - options 배열 지원 라디오 그룹 컴포넌트
 *
 * [목적]
 * Ant Design Radio.Group을 래핑하여 options 배열로 라디오 버튼을 간편하게 생성한다.
 * options를 전달하면 자동으로 Radio 항목을 렌더링하며,
 * 전달하지 않으면 children으로 직접 Radio 컴포넌트를 배치할 수 있다.
 *
 * @param options - { value, label }[] 배열 (선택 시 Radio 자동 생성)
 *
 * [사용 방법]
 * @example
 * // options 배열 사용 (권장)
 * <CustomRadioGroup
 *   options={[
 *     { value: 'Y', label: '사용' },
 *     { value: 'N', label: '미사용' },
 *   ]}
 *   value={useYn}
 *   onChange={(e) => setUseYn(e.target.value)}
 * />
 *
 * // children 직접 배치
 * <CustomRadioGroup value={type} onChange={(e) => setType(e.target.value)}>
 *   <Radio value="A">유형 A</Radio>
 *   <Radio value="B">유형 B</Radio>
 * </CustomRadioGroup>
 */
import React from 'react';
import {Radio, RadioGroupProps} from 'antd';

interface CustomRadioGroupProps extends RadioGroupProps {
    options?: {value: any; label: string}[];
}

const CustomRadioGroup = ({options, children, ...restProps}: CustomRadioGroupProps) => {
    return (
        <Radio.Group {...restProps}>
            {options
                ? options.map((item) => (
                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                ))
                : children
            }
        </Radio.Group>
    );
};

export default CustomRadioGroup;
