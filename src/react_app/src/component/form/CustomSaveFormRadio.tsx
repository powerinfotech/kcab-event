/**
 * CustomSaveFormRadio - react-hook-form 연동 라디오 그룹 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 제목(label) + 라디오 그룹 + 유효성 툴팁을 한 번에 렌더링한다.
 *
 * [주요 Props]
 * @param name           - react-hook-form 필드 이름
 * @param control        - useForm()의 control 객체
 * @param rules          - react-hook-form 유효성 규칙
 * @param options        - { value, label }[] 배열로 라디오 버튼 자동 생성
 * @param defaultValue   - 초기 선택값
 * @param onChangeValue  - 선택 변경 시 string 값 전달 콜백
 * @param title          - 필드 제목 레이블 텍스트
 * @param required       - 필수 여부 표시
 *
 * [사용 방법]
 * @example
 * import CustomSaveFormRadio from '@component/form/CustomSaveFormRadio';
 *
 * const { control } = useForm({ defaultValues: { gender: 'M' } });
 *
 * <CustomSaveFormRadio
 *   name="gender"
 *   control={control}
 *   title="성별"
 *   required
 *   options={[
 *     { value: 'M', label: '남성' },
 *     { value: 'F', label: '여성' },
 *   ]}
 *   rules={{ required: '성별을 선택해주세요.' }}
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

const CustomSaveFormRadio = forwardRef<HTMLDivElement, CustomRadioProps>(({name, control, defaultValue, onChangeValue, options, rules, ...props}, ref) => {
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div ref={ref}>
                    <span className="tit">{props.title}{props.required ? <em>*</em> : <></>}</span>
                    <div className="box-inp">
                        <Tooltip title={(field.value === undefined && fieldState.error?.message) ?fieldState.error?.message :  ''}
                                 open={field.value === undefined && fieldState.error !== undefined && focus}>
                            <div className={field.value === undefined && fieldState.error !== undefined ? 'tooltip error' : ''}>
                                  <Radio.Group
                                      {...props}
                                      id={field.name}
                                      name={field.name}
                                      value={field.value}
                                      onChange={(v)=>{
                                          field.onChange(v);
                                          onChangeValue&&onChangeValue(v.target.value);
                                      }}
                                      onBlur={field.onBlur}
                                      onMouseEnter={() => setFocus(true)}
                                      onMouseLeave={() => setFocus(false)}
                                  >
                                      {options&&options.map((item)=> {
                                          return <Radio key={item.value} value={item.value}>{item.label}</Radio>;
                                      })}
                                </Radio.Group>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            )}
        />
    );
});

CustomSaveFormRadio.displayName = 'CustomSaveFormRadio';

export default CustomSaveFormRadio;