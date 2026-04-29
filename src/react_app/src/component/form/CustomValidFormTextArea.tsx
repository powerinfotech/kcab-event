/**
 * CustomValidFormTextArea - react-hook-form 연동 텍스트 영역 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 TextArea + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormTextArea와의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 * - 주로 테이블 인라인 편집, 커스텀 레이아웃에 사용
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormTextArea from '@component/form/CustomValidFormTextArea';
 *
 * const { control } = useForm();
 *
 * // 테이블 셀 인라인 편집
 * <CustomValidFormTextArea
 *   name="cellMemo"
 *   control={control}
 *   rows={2}
 *   onChangeValue={(v) => updateCell(v)}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Input, Tooltip} from 'antd';
import type {TextAreaProps} from 'antd/es/input';
import {Controller} from 'react-hook-form';

interface CustomFormTextAreaProps extends TextAreaProps {
    name:string;
    defaultValue?:string;
    control:any;
    onChangeValue?:(v:string)=>void;
    [key: string]: any;
}

const CustomValidFormTextArea = forwardRef<any, CustomFormTextAreaProps>(({name, defaultValue, control, onChangeValue, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                    <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <Input.TextArea
                            {...props}
                            ref={ref}
                            id={field.name}
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(v) => {
                                field.onChange(v);
                                onChangeValue && onChangeValue(v.target.value);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
});

CustomValidFormTextArea.displayName = 'CustomValidFormTextArea';

export default CustomValidFormTextArea;
