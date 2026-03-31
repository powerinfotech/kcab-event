/**
 * CustomPassword - 정규식 검증 + 포커스 전체선택 비밀번호 입력 컴포넌트
 *
 * [목적]
 * Ant Design Input.Password를 래핑하여 다음 기능을 추가한다.
 * 1. 정규식(regExp) 검증 실패 시 입력 차단 + 툴팁 에러 메시지 표시
 * 2. 포커스 시 전체 선택 (onFocus → select())
 * 3. 눈 아이콘으로 비밀번호 표시/숨김 전환 (Ant Design 기본 제공)
 *
 * [IME 미적용 이유]
 * 비밀번호는 영문+숫자+특수문자 조합이 일반적이므로 IME 처리를 생략한다.
 *
 * @param regExp - 입력값 정규식 검증 규칙 { value: RegExp, message: string }
 *
 * [사용 방법]
 * @example
 * import CustomPassword from '@component/input/CustomPassword';
 * import { PASSWORD_REGEXP } from '@util/validationPatterns';
 *
 * // 기본 비밀번호 입력
 * <CustomPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   placeholder="비밀번호 입력"
 * />
 *
 * // 비밀번호 형식 검증 (영문+숫자+특수문자 8자 이상)
 * <CustomPassword
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   regExp={PASSWORD_REGEXP}
 *   placeholder="영문+숫자+특수문자 8자 이상"
 * />
 *
 * // 비밀번호 확인 (표시 버튼 숨김)
 * <CustomPassword
 *   value={confirmPassword}
 *   onChange={(e) => setConfirmPassword(e.target.value)}
 *   visibilityToggle={false}
 *   placeholder="비밀번호 확인"
 * />
 */
import React, { useEffect, useState } from 'react';
import { Input, Tooltip } from 'antd';
import type { PasswordProps } from 'antd/es/input';

interface CustomPasswordProps extends PasswordProps {
    /** 입력값 정규식 검증 규칙 - 실패 시 입력 차단 + 툴팁 에러 표시 */
    regExp?: { value: RegExp; message: string };
}

const CustomPassword = ({ regExp, onChange, onFocus, ...props }: CustomPasswordProps) => {
    /** 정규식 검증 실패 상태 (true이면 툴팁 에러 표시) */
    const [validError, setValidError] = useState(false);
    /** 마우스 호버 여부 - 툴팁 표시 조건 */
    const [hover, setHover] = useState(false);
    /** 입력 차단 구현을 위한 내부 상태 (regExp 실패 시 갱신 안 함 → 화면에 표시 안 됨) */
    const [internalValue, setInternalValue] = useState<string>(String(props.value ?? ''));

    // 외부 value 변경 시 내부 상태 동기화
    useEffect(() => {
        setInternalValue(String(props.value ?? ''));
    }, [props.value]);

    /**
     * 입력값 변경 핸들러
     * 정규식 검증 실패 시 setInternalValue 호출 안 함 → 화면에 잘못된 문자 표시 안 됨
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if (regExp && !regExp.value.test(e.target.value)) {
            setValidError(true);
            return;
        }
        setInternalValue(e.target.value);
        onChange?.(e);
    };

    return (
        <Tooltip
            title={validError && regExp?.message ? regExp.message : ''}
            open={validError && hover}
        >
            <div className={validError ? 'tooltip error' : ''}>
                <Input.Password
                    {...props}
                    value={internalValue}
                    onChange={handleChange}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => { setHover(false); setValidError(false); }}
                    onFocus={(e) => {
                        e.target.select(); // 포커스 시 전체 선택
                        onFocus?.(e);      // 외부 onFocus 콜백 유지
                    }}
                />
            </div>
        </Tooltip>
    );
};

export default CustomPassword;
