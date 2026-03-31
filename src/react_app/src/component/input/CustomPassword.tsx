/**
 * CustomPassword - Ant Design Input.Password 래퍼 컴포넌트
 *
 * [목적]
 * 비밀번호 입력 전용 컴포넌트다. 눈 모양 아이콘으로 비밀번호 표시/숨김 전환이 기본 제공된다.
 * regExp prop으로 비밀번호 정책 검증을 추가할 수 있으며, 포커스 시 Tooltip으로 에러를 표시한다.
 *
 * @param regExp        - 비밀번호 검증 정규식 (없으면 검증 없음)
 * @param regExpMessage - 검증 실패 시 Tooltip 메시지 (기본: '비밀번호 형식이 올바르지 않습니다')
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
 * // 비밀번호 정책 검증 (영문+숫자+특수문자 8자 이상)
 * <CustomPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   regExp={/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/}
 *   regExpMessage="영문, 숫자, 특수문자 포함 8자 이상"
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
import React, {useCallback, useState} from 'react';
import {Input, Tooltip} from 'antd';
import type {PasswordProps} from 'antd/es/input';

interface CustomPasswordProps extends PasswordProps {
    regExp?: RegExp;
    regExpMessage?: string;
}

const CustomPassword = ({regExp, regExpMessage = '비밀번호 형식이 올바르지 않습니다', onChange, ...rest}: CustomPasswordProps) => {
    const [isValid, setIsValid] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (regExp) {
                const value = e.target.value;
                setIsValid(value === '' || regExp.test(value));
            }
            onChange?.(e);
        },
        [regExp, onChange]
    );

    return (
        <Tooltip title={regExpMessage} open={!isValid && isFocused}>
            <Input.Password
                {...rest}
                status={!isValid ? 'error' : rest.status}
                onChange={handleChange}
                onFocus={(e) => { setIsFocused(true); rest.onFocus?.(e); }}
                onBlur={(e) => { setIsFocused(false); rest.onBlur?.(e); }}
            />
        </Tooltip>
    );
};

export default CustomPassword;
