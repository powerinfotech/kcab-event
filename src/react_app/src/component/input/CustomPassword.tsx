/**
 * CustomPassword - Ant Design Input.Password 래퍼 컴포넌트
 *
 * [목적]
 * 비밀번호 입력 전용 컴포넌트다. 눈 모양 아이콘으로 비밀번호 표시/숨김 전환이 기본 제공된다.
 *
 * [사용 방법]
 * @example
 * import CustomPassword from '@component/input/CustomPassword';
 *
 * <CustomPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   placeholder="비밀번호 입력"
 * />
 *
 * // 비밀번호 확인 입력
 * <CustomPassword
 *   value={confirmPassword}
 *   onChange={(e) => setConfirmPassword(e.target.value)}
 *   placeholder="비밀번호 확인"
 *   visibilityToggle={false}
 * />
 */
import React from 'react';
import {Input} from 'antd';
import type {PasswordProps} from 'antd/es/input';

interface CustomPasswordProps extends PasswordProps {}

const CustomPassword = (props: CustomPasswordProps) => {
    return (
        <Input.Password {...props} />
    );
};

export default CustomPassword;
