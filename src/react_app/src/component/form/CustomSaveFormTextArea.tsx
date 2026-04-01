/**
 * CustomSaveFormTextArea - react-hook-form 연동 텍스트 영역 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + TextArea + 유효성 툴팁을 한 번에 렌더링한다.
 * 비고, 설명, 메모 등 여러 줄 텍스트 입력에 사용한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param onChangeValue  - 값 변경 시 string 전달 콜백
 * @param singleRow      - true이면 'full' 클래스 적용 (전체 너비 단독 행)
 * @param isNoTitle      - true이면 제목 레이블 미표시
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시 (*) 아이콘
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormTextArea from '@component/form/CustomSaveFormTextArea';
 *
 * const { control } = useForm();
 *
 * // 기본 텍스트 영역
 * <CustomSaveFormTextArea
 *   name="remark"
 *   control={control}
 *   title="비고"
 *   rows={4}
 *   rules={{ maxLength: { value: 500, message: '500자 이내로 입력해주세요.' } }}
 * />
 *
 * // 전체 너비 + 자동 높이
 * <CustomSaveFormTextArea
 *   name="description"
 *   control={control}
 *   title="상세 설명"
 *   singleRow
 *   autoSize={{ minRows: 3, maxRows: 10 }}
 * />
 *
 * // 글자 수 표시
 * <CustomSaveFormTextArea
 *   name="memo"
 *   control={control}
 *   title="메모"
 *   maxLength={200}
 *   showCount
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Input, Tooltip} from 'antd';
import type {TextAreaProps} from 'antd/es/input';
import {Control, Controller, FieldValues} from 'react-hook-form';

interface CustomFormTextAreaProps extends TextAreaProps {
    name:string;
    defaultValue?:string;
    control:Control<FieldValues>;
    rules?: any;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    [key: string]: any;
}

const CustomSaveFormTextArea = forwardRef<any, CustomFormTextAreaProps>(({ name, defaultValue, control, rules, onChangeValue, singleRow = false, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className={singleRow ? 'full' : props.isNoTitle === true ? 'no-title' : ''}>
                    {props.isNoTitle !== true && (
                        <span className="tit mt0">{props.title}{props.required ? <em>*</em> : null}</span>
                    )}
                    <div className="box-inp">
                        <Tooltip
                            title={fieldState.error?.message ?? ''}
                            open={fieldState.error !== undefined && focus}
                        >
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
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormTextArea.displayName = 'CustomSaveFormTextArea';

export default CustomSaveFormTextArea;
