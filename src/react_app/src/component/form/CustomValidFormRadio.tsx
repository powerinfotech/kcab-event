/**
 * CustomValidFormRadio - react-hook-form 연동 라디오 그룹 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 라디오 그룹 + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormRadio와의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 * - 주로 테이블 인라인 편집, 커스텀 레이아웃에 사용
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param options        - { value, label }[] 배열로 라디오 버튼 자동 생성
 * @param defaultValue   - 초기 선택값
 * @param onChangeValue  - 선택 변경 시 string 값 전달 콜백
 *
 * [사용 방법]
 * @example
 * import CustomValidFormRadio from '@component/form/CustomValidFormRadio';
 *
 * const { control } = useForm({ defaultValues: { useYn: 'Y' } });
 *
 * <CustomValidFormRadio
 *   name="useYn"
 *   control={control}
 *   options={[
 *     { value: 'Y', label: '사용' },
 *     { value: 'N', label: '미사용' },
 *   ]}
 *   onChangeValue={(v) => console.log('선택:', v)}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Radio, RadioProps, Tooltip} from 'antd';
import {Control, Controller, FieldValues} from 'react-hook-form';

interface CustomRadioProps extends RadioProps {
    name:string;
    control:Control<FieldValues>;
    defaultValue?:any;
    onChangeValue?: (v:string) => void;
    options?: {value:any, label:string }[];
    rules?: any;
    [key: string]: any;
};

const CustomValidFormRadio = forwardRef<HTMLDivElement, CustomRadioProps>(({name, control, defaultValue, onChangeValue, options, rules, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <Tooltip title={(field.value === undefined && fieldState.error?.message) ? fieldState.error?.message : ''}
                         open={field.value === undefined && fieldState.error !== undefined && focus}>
                    <div ref={ref} className={field.value === undefined && fieldState.error !== undefined ? 'tooltip error' : ''}>
                        <Radio.Group
                            {...props}
                            id={field.name}
                            name={field.name}
                            value={field.value}
                            onChange={(v) => {
                                field.onChange(v);
                                onChangeValue && onChangeValue(v.target.value);
                            }}
                            onBlur={field.onBlur}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => setFocus(false)}
                        >
                            {options && options.map((item) => {
                                return <Radio key={item.value} value={item.value}>{item.label}</Radio>;
                            })}
                        </Radio.Group>
                    </div>
                </Tooltip>
            )}
        />
    );
});

CustomValidFormRadio.displayName = 'CustomValidFormRadio';

export default CustomValidFormRadio;
