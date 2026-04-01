/**
 * CustomInput - 정규식 검증 + IME(한글) 안전 처리 텍스트 입력 컴포넌트
 *
 * [목적]
 * Ant Design Input을 래핑하여 다음 기능을 추가한다.
 * 1. 정규식(regExp) 검증 실패 시 입력 차단 + 툴팁 에러 메시지 표시
 * 2. 한글/중국어 등 IME 조합 중 onChange 이벤트 중복 발생 방지
 * 3. 포커스 시 전체 선택 (onFocus → select())
 *
 * [IME 처리 설명]
 * 한글 입력 시 compositionstart → compositionend 이벤트가 발생한다.
 * 조합 중(isComposingRef=true)에는 onChange를 호출하지 않고,
 * 조합 완료(compositionend) 시에만 1회 onChange를 호출한다.
 * 이를 통해 'ㄱ', '가', '각' 처럼 중간 조합 단계에서 불필요한 이벤트 발생을 막는다.
 *
 * [사용 방법]
 * @example
 * // 기본 사용 (Ant Design Input과 동일)
 * <CustomInput value={value} onChange={(e) => setValue(e.target.value)} />
 *
 * // 정규식 검증 적용 (영문+숫자만 허용)
 * import { ALPHANUMERIC_REGEXP } from '@util/validationPatterns';
 *
 * <CustomInput
 *   value={userId}
 *   onChange={(e) => setUserId(e.target.value)}
 *   regExp={ALPHANUMERIC_REGEXP}
 *   placeholder="영문과 숫자만 입력 가능합니다"
 * />
 * // → 한글 입력 시 차단되고 "영어와 숫자만 입력 가능합니다." 툴팁 표시
 *
 * // 직접 정규식 지정
 * <CustomInput
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   regExp={{ value: /^\d{0,10}$/, message: '숫자만 10자리까지 입력 가능합니다.' }}
 * />
 *
 * // forwardRef 지원 (ref 전달 가능)
 * const inputRef = useRef<any>(null);
 * <CustomInput ref={inputRef} />
 * inputRef.current?.focus();
 */
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Input, InputProps, Tooltip} from 'antd';

/** CustomInput Props */
interface CustomInputProps extends InputProps {
    /**
     * 입력값 정규식 검증 규칙
     * - value: 검증할 정규식
     * - message: 검증 실패 시 툴팁으로 표시할 메시지
     * - validationPatterns.ts의 상수를 그대로 사용 가능
     */
    regExp?: { value: RegExp; message: string };
}

/**
 * 정규식 검증 + IME 안전 처리 텍스트 입력 컴포넌트
 *
 * @param props.regExp   - 입력값 정규식 검증 규칙 (선택)
 * @param props.value    - 입력 값 (controlled)
 * @param props.onChange - 값 변경 핸들러
 * @param ref            - forwardRef (외부에서 input DOM에 접근 시 사용)
 */
const CustomInput = forwardRef<any, CustomInputProps>((props, ref) => {
    const { regExp, ...restProps } = props;

    const [focus, setFocus] = useState<boolean>(false);
    /** 정규식 검증 실패 상태 (true이면 툴팁 에러 표시) */
    const [validError, setValidError] = useState<boolean>(false);
    /** IME 조합 중 외부 value 변경을 막기 위한 내부 상태 */
    const [internalValue, setInternalValue] = useState(props.value ?? '');
    /** 한글/IME 조합 진행 중 여부 (true이면 onChange 호출 보류) */
    const isComposingRef = useRef(false);

    // 외부 value가 변경되면 내부 상태 동기화 (IME 조합 중에는 무시)
    useEffect(() => {
        if (!isComposingRef.current) {
            setInternalValue(props.value ?? '');
        }
    }, [props.value]);

    /**
     * 입력값 변경 핸들러
     * - 정규식 검증 실패 시 입력 차단 + 에러 툴팁 표시
     * - IME 조합 중에는 내부 상태만 업데이트하고 onChange 호출 보류
     */
    const handleChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        // 정규식 검증 실패 시 입력 차단
        if (regExp && regExp.value && !regExp.value.test(v.target.value)) {
            setValidError(true);
            return;
        }
        setInternalValue(v.target.value);
        // IME 조합 중이 아닐 때만 외부 onChange 호출
        if (!isComposingRef.current) {
            props.onChange && props.onChange(v);
        }
    };

    /** IME 조합 시작 (한글 첫 자음/모음 입력 시) → onChange 보류 */
    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    /**
     * IME 조합 완료 (한글 한 글자 완성 시) → onChange 1회 호출
     * compositionend 이후 onChange가 발생하므로 여기서 외부에 최종값 전달
     */
    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false;
        if (props.onChange) {
            props.onChange({
                target: e.target,
                currentTarget: e.currentTarget,
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        // 검증 실패 시 Tooltip으로 에러 메시지 표시
        <Tooltip
            title={validError && regExp?.message ? regExp.message : ''}
            open={validError && regExp?.message !== undefined}
        >
            {/* 검증 실패 시 'tooltip error' 클래스로 스타일 적용 */}
            <div className={validError && regExp?.message !== undefined ? 'tooltip error' : ''}>
                <Input
                    {...restProps}
                    ref={ref}
                    value={internalValue}
                    onChange={(v) => handleChange(v)}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onMouseEnter={() => setFocus(true)}
                    onMouseLeave={() => { setFocus(false); setValidError(false); }}
                    onFocus={(e) => e.target.select()}  // 포커스 시 전체 선택
                />
            </div>
        </Tooltip>
    );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;