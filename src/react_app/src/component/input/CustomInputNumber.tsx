/**
 * CustomInputNumber - 포커스 전체선택 숫자 입력 컴포넌트
 *
 * [목적]
 * Ant Design InputNumber를 래핑하여 다음 기능을 추가한다.
 * 1. 포커스 시 전체 선택 (onFocus → select()) — 기존 숫자 바로 덮어쓰기 가능
 *
 * [IME / regExp 미적용 이유]
 * InputNumber는 숫자 입력 전용으로 Ant Design 자체적으로 숫자 외 입력을 제어한다.
 *
 * [사용 방법]
 * @example
 * import CustomInputNumber from '@component/input/CustomInputNumber';
 *
 * // 기본 숫자 입력 (포커스 시 전체 선택)
 * <CustomInputNumber
 *   value={count}
 *   onChange={(v) => setCount(v)}
 *   min={0}
 *   max={999}
 * />
 *
 * // 금액 입력 (천단위 구분자)
 * <CustomInputNumber
 *   value={amount}
 *   onChange={setAmount}
 *   formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
 *   parser={(v) => v?.replace(/,/g, '') as any}
 *   style={{ width: 150 }}
 * />
 *
 * // 소수점 입력
 * <CustomInputNumber
 *   value={rate}
 *   onChange={setRate}
 *   min={0}
 *   max={100}
 *   step={0.1}
 *   precision={1}
 * />
 *
 * // 외부 onFocus 유지 (전체선택 + 외부 콜백 동시 실행)
 * <CustomInputNumber
 *   value={value}
 *   onChange={setValue}
 *   onFocus={(e) => console.log('포커스됨')}
 * />
 */
import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';

interface CustomInputNumberProps extends InputNumberProps {}

const CustomInputNumber = ({ onFocus, ...props }: CustomInputNumberProps) => {
    return (
        <InputNumber
            {...props}
            onFocus={(e) => {
                e.target.select(); // 포커스 시 전체 선택 → 기존 숫자 바로 덮어쓰기
                onFocus?.(e);      // 외부 onFocus 콜백 유지
            }}
        />
    );
};

export default CustomInputNumber;
