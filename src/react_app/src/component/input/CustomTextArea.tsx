/**
 * CustomTextArea - IME(한글) 안전 처리 + 정규식 검증 다중 줄 텍스트 입력 컴포넌트
 *
 * [목적]
 * Ant Design Input.TextArea를 래핑하여 다음 기능을 추가한다.
 * 1. 한글/IME 조합 중 onChange 이벤트 중복 발생 방지
 * 2. 정규식(regExp) 검증 실패 시 입력 차단 + 툴팁 에러 메시지 표시
 *
 * [IME 처리 설명]
 * 한글 입력 시 compositionstart → compositionend 이벤트가 발생한다.
 * 조합 중(isComposingRef=true)에는 onChange를 호출하지 않고,
 * 조합 완료(compositionend) 시에만 1회 onChange를 호출한다.
 * 자동저장, 실시간 API 연동 등 onChange에 로직이 있을 때 중간 조합값 전달을 방지한다.
 *
 * [포커스 전체선택 미적용 이유]
 * TextArea는 여러 줄 텍스트 편집 특성상 커서 위치가 중요하므로
 * 포커스 시 전체 선택을 기본 적용하지 않는다.
 *
 * @param regExp - 입력값 정규식 검증 규칙 { value: RegExp, message: string }
 *
 * [사용 방법]
 * @example
 * import CustomTextArea from '@component/input/CustomTextArea';
 *
 * // 기본 다중 줄 입력 (한글 IME 안전)
 * <CustomTextArea
 *   value={memo}
 *   onChange={(e) => setMemo(e.target.value)}
 *   placeholder="메모 입력"
 *   rows={4}
 * />
 *
 * // 자동 높이 + 글자수 표시
 * <CustomTextArea
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   autoSize={{ minRows: 2, maxRows: 8 }}
 *   maxLength={500}
 *   showCount
 * />
 *
 * // 정규식 검증 (영문+숫자+공백만 허용)
 * <CustomTextArea
 *   value={content}
 *   onChange={(e) => setContent(e.target.value)}
 *   regExp={{ value: /^[a-zA-Z0-9\s]*$/, message: '영문과 숫자만 입력 가능합니다.' }}
 * />
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, Tooltip } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

interface CustomTextAreaProps extends TextAreaProps {
    /** 입력값 정규식 검증 규칙 - 실패 시 입력 차단 + 툴팁 에러 표시 */
    regExp?: { value: RegExp; message: string };
}

const CustomTextArea = ({ regExp, onChange, ...props }: CustomTextAreaProps) => {
    /** IME 조합 중 외부 value 변경을 막기 위한 내부 상태 */
    const [internalValue, setInternalValue] = useState<string>(String(props.value ?? ''));
    /** 정규식 검증 실패 상태 */
    const [validError, setValidError] = useState(false);
    /** 마우스 호버 여부 - 툴팁 표시 조건 */
    const [hover, setHover] = useState(false);
    /** 한글/IME 조합 진행 중 여부 (true이면 onChange 호출 보류) */
    const isComposingRef = useRef(false);

    // 외부 value 변경 시 내부 상태 동기화 (IME 조합 중에는 무시)
    useEffect(() => {
        if (!isComposingRef.current) {
            setInternalValue(String(props.value ?? ''));
        }
    }, [props.value]);

    /**
     * 입력값 변경 핸들러
     * - 정규식 검증 실패 시 입력 차단
     * - IME 조합 중에는 내부 상태만 업데이트, onChange 호출 보류
     */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValidError(false);
        if (regExp && !regExp.value.test(e.target.value)) {
            setValidError(true);
            return;
        }
        setInternalValue(e.target.value);
        // IME 조합 중이 아닐 때만 외부 onChange 호출
        if (!isComposingRef.current) {
            onChange?.(e);
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
    const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
        isComposingRef.current = false;
        if (onChange) {
            onChange({
                target: e.target,
                currentTarget: e.currentTarget,
            } as React.ChangeEvent<HTMLTextAreaElement>);
        }
    };

    return (
        <Tooltip
            title={validError && regExp?.message ? regExp.message : ''}
            open={validError && hover}
        >
            <div className={validError ? 'tooltip error' : ''}>
                <TextArea
                    {...props}
                    value={internalValue}
                    onChange={handleChange}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => { setHover(false); setValidError(false); }}
                />
            </div>
        </Tooltip>
    );
};

export default CustomTextArea;
