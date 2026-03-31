/**
 * CustomSaveFormSelect - react-hook-form 연동 셀렉트 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 셀렉트 + 유효성 툴팁을 한 번에 렌더링한다.
 *
 * [주요 Props]
 * @param name              - react-hook-form 필드 이름
 * @param control           - useForm()의 control 객체
 * @param rules             - react-hook-form 유효성 규칙
 * @param nullFlag          - true이면 options 앞에 빈 항목 { label: '', value: '' } 자동 추가
 * @param nullText          - 빈 항목의 텍스트 (기본: '')
 * @param onChangeValueback - 선택 시 option 객체 전달 콜백
 * @param title             - 필드 제목 레이블 텍스트
 * @param required          - 필수 여부 표시
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormSelect from '@component/form/CustomSaveFormSelect';
 *
 * const { control } = useForm();
 * const statusOptions = [
 *   { label: '활성', value: 'Y' },
 *   { label: '비활성', value: 'N' },
 * ];
 *
 * // 기본 셀렉트
 * <CustomSaveFormSelect
 *   name="useYn"
 *   control={control}
 *   title="사용 여부"
 *   required
 *   options={statusOptions}
 *   rules={{ required: '사용 여부를 선택해주세요.' }}
 * />
 *
 * // 전체 선택 항목 포함 (nullFlag)
 * <CustomSaveFormSelect
 *   name="status"
 *   control={control}
 *   title="상태"
 *   nullFlag
 *   options={statusOptions}
 *   onChangeValueback={(option) => console.log('선택된 항목:', option)}
 * />
 */
import React, {forwardRef, useState} from 'react';
import {Select, SelectProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';

interface CustomFormSelectProps extends SelectProps {
    name:string;
    defaultValue?:string;
    control:Control<any>;
    rules?: any;
    onChangeValueback?:(v:any)=>void;
    nullFlag?:boolean;
    nullText?:string;
    [key: string]: any;
}

const CustomSaveFormSelect = forwardRef<any, CustomFormSelectProps>(({ name, defaultValue, control, rules, onChangeValueback, ...props }, ref) => {
    const [focus, setFocus] = useState<boolean>(false);
    const options = props.nullFlag ? [{ label: '', value: '' }, ...(props.options ?? [])] : props.options;
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div>
                    <span className="tit mt0">{props.title}{props.required ? <em>*</em> : null}</span>
                    <div className="box-inp">
                        <Tooltip title={fieldState.error?.message ?? ''} open={fieldState.error !== undefined && focus}>
                            <div className={fieldState.error !== undefined ? 'tooltip error' : ''}>
                                <Select
                                    {...props}
                                    ref={ref}
                                    id={field.name}
                                    value={field.value}
                                    onChange={(v, option) => {
                                        field.onChange(v);
                                        onChangeValueback && onChangeValueback(option);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => setFocus(false)}
                                    options={options}
                                />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormSelect.displayName = 'CustomSaveFormSelect';

export default CustomSaveFormSelect;