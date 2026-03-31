/**
 * CustomTextArea - Ant Design Input.TextArea 래퍼 컴포넌트
 *
 * [목적]
 * 여러 줄 텍스트 입력 전용 컴포넌트다.
 * 비고, 설명, 메모 등 긴 텍스트를 입력할 때 사용한다.
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
 */
import React from 'react';
import {Input} from 'antd';
import type {TextAreaProps} from 'antd/es/input';

const {TextArea} = Input;

interface CustomTextAreaProps extends TextAreaProps {}

const CustomTextArea = (props: CustomTextAreaProps) => {
    return (
        <TextArea {...props} />
    );
};

export default CustomTextArea;
