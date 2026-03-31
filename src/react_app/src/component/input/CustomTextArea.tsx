/**
 * CustomTextArea - Ant Design Input.TextArea 래퍼 컴포넌트
 *
 * [목적]
 * 여러 줄 텍스트 입력 전용 컴포넌트다.
 * 비고, 설명, 메모 등 긴 텍스트를 입력할 때 사용한다.
 *
 * @param suppressOnComposing - true이면 한글 등 IME 조합 중 onChange를 억제하고 조합 완료 후 한 번만 호출 (기본: false)
 *
 * [사용 방법]
 * @example
 * import CustomTextArea from '@component/input/CustomTextArea';
 *
 * // 기본 다중 줄 입력
 * <CustomTextArea
 *   value={memo}
 *   onChange={(e) => setMemo(e.target.value)}
 *   placeholder="메모 입력"
 *   rows={4}
 * />
 *
 * // 자동 높이 조절
 * <CustomTextArea
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   autoSize={{ minRows: 2, maxRows: 8 }}
 * />
 *
 * // 글자 수 표시
 * <CustomTextArea maxLength={500} showCount />
 *
 * // IME 조합 중 onChange 억제 (실시간 미리보기, 자동저장 등에서 사용)
 * <CustomTextArea
 *   suppressOnComposing
 *   value={text}
 *   onChange={(e) => setText(e.target.value)}
 * />
 */
import React, {useCallback, useRef} from 'react';
import {Input} from 'antd';
import type {TextAreaProps} from 'antd/es/input';

const {TextArea} = Input;

interface CustomTextAreaProps extends TextAreaProps {
    suppressOnComposing?: boolean;
}

const CustomTextArea = ({suppressOnComposing = false, onChange, onCompositionStart, onCompositionEnd, ...rest}: CustomTextAreaProps) => {
    const isComposingRef = useRef(false);
    const latestEventRef = useRef<React.ChangeEvent<HTMLTextAreaElement> | null>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (suppressOnComposing && isComposingRef.current) {
                latestEventRef.current = e;
                return;
            }
            onChange?.(e);
        },
        [suppressOnComposing, onChange]
    );

    const handleCompositionStart = useCallback(
        (e: React.CompositionEvent<HTMLTextAreaElement>) => {
            isComposingRef.current = true;
            onCompositionStart?.(e);
        },
        [onCompositionStart]
    );

    const handleCompositionEnd = useCallback(
        (e: React.CompositionEvent<HTMLTextAreaElement>) => {
            isComposingRef.current = false;
            if (suppressOnComposing && latestEventRef.current) {
                onChange?.(latestEventRef.current);
                latestEventRef.current = null;
            }
            onCompositionEnd?.(e);
        },
        [suppressOnComposing, onChange, onCompositionEnd]
    );

    return (
        <TextArea
            {...rest}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
        />
    );
};

export default CustomTextArea;
