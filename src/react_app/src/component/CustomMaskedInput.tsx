import React, { useCallback } from 'react';
import { Input, InputProps } from 'antd';

export type MaskType = 'phone' | 'bizNo' | 'custom';

interface CustomMaskedInputProps extends Omit<InputProps, 'onChange'> {
  maskType: MaskType;
  customMask?: (value: string) => string;
  onChange?: (value: string) => void;
}

const MASK_FORMATS: Record<string, (v: string) => string> = {
  phone: (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  },
  bizNo: (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 10);
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5)}`;
  },
};

const CustomMaskedInput = ({ maskType, customMask, onChange, value, ...rest }: CustomMaskedInputProps) => {
  const formatValue = useCallback(
    (raw: string) => {
      if (maskType === 'custom' && customMask) return customMask(raw);
      return MASK_FORMATS[maskType]?.(raw) ?? raw;
    },
    [maskType, customMask]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValue(e.target.value);
    onChange?.(formatted);
  };

  return (
    <Input
      {...rest}
      value={value != null ? formatValue(String(value)) : ''}
      onChange={handleChange}
    />
  );
};

export default CustomMaskedInput;
