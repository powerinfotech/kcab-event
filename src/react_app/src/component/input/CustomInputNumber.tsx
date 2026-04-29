/**
 * CustomInputNumber - Ant Design InputNumber 래퍼 컴포넌트
 *
 * [목적]
 * 숫자 입력 전용 컴포넌트다. 최솟값/최댓값 제한, 증감 버튼, 형식 지정 등을 지원한다.
 * 포커스 시 기존 값을 전체선택하여 즉시 새 값을 입력할 수 있다.
 *
 * @param selectOnFocus - 포커스 시 전체선택 여부 (기본: true)
 *
 * [사용 방법]
 * @example
 * import CustomInputNumber from '@component/input/CustomInputNumber';
 *
 * // 기본 숫자 입력
 * <CustomInputNumber value={count} onChange={(v) => setCount(v)} min={0} max={999} />
 *
 * // 금액 입력 (천단위 구분자)
 * <CustomInputNumber
 *   value={amount}
 *   onChange={setAmount}
 *   formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v?.replace(/,/g, '') as any}
 * />
 *
 * // 소수점
 * <CustomInputNumber value={rate} onChange={setRate} min={0} max={100} step={0.1} />
 */
import React, {useCallback} from 'react';
import {InputNumber, InputNumberProps} from 'antd';

interface CustomInputNumberProps extends InputNumberProps<number> {
    selectOnFocus?: boolean;
}

const CustomInputNumber = ({selectOnFocus = true, onFocus, ...rest}: CustomInputNumberProps) => {
    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (selectOnFocus) {
                e.target.select();
            }
            onFocus?.(e);
        },
        [selectOnFocus, onFocus]
    );

    return (
        <InputNumber {...rest} onFocus={handleFocus} />
    );
};

export default CustomInputNumber;
