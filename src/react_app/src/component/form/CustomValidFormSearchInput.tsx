/**
 * CustomValidFormSearchInput - react-hook-form 연동 검색 입력 컴포넌트 (인라인 유효성 표시용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하면서 제목 레이블 없이 Input.Search + 툴팁만 렌더링한다.
 * 테이블 셀 편집, 인라인 폼 등 자유 레이아웃에 사용한다.
 *
 * [CustomSaveFormSearchInput과의 차이]
 * - 제목(tit) 레이블 없음
 * - box-inp 래퍼 없음
 * - singleRow, isNoTitle 속성 없음
 *
 * [주요 Props]
 * @param name               - react-hook-form 필드 이름
 * @param control            - useForm()의 control 객체
 * @param onChangeValue      - 값 변경 시 string 전달 콜백
 * @param onlyUseButtonFlag  - true이면 텍스트 입력 불가, 버튼 클릭으로만 값 설정
 * @param onClickSearchBtn   - 검색 버튼 클릭 콜백 (onlyUseButtonFlag=true일 때 팝업 오픈)
 * @param disabledButton     - 검색 버튼 비활성화 여부
 * @param regExp             - 정규식 검증 { value, message }
 *
 * [사용 방법]
 * @example
 * import CustomValidFormSearchInput from '@component/form/CustomValidFormSearchInput';
 *
 * const { control } = useForm();
 *
 * // 직접 입력 + 검색
 * <CustomValidFormSearchInput
 *   name="keyword"
 *   control={control}
 *   onChangeValue={(v) => setKeyword(v)}
 * />
 *
 * // 팝업으로만 선택 (읽기 전용 + 버튼)
 * <CustomValidFormSearchInput
 *   name="userId"
 *   control={control}
 *   onlyUseButtonFlag
 *   onClickSearchBtn={() => setPopupOpen(true)}
 * />
 */
import React, {useEffect, useState} from 'react';
import {Button, Input, InputProps, Tooltip} from 'antd';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {SearchOutlined} from "@ant-design/icons";
import IconBtnSearch from "@icon/IconBtnSearch";

interface CustomFormSearchInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<FieldValues>;
    onChangeValue?:(v:string)=>void;
    onlyUseButtonFlag?: boolean;
    disabledButton?: boolean;
    onClickSearchBtn?: () => void;
    [key: string]: any;
}

const CustomValidFormSearchInput = ({name, defaultValue, control, onChangeValue, ...props}:CustomFormSearchInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field:any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if(props.regExp && props.regExp.value && !props.regExp?.value.test(v.target.value)){
            setValidError(true);
            return;
        }
        field.onChange(v);
        onChangeValue && onChangeValue(v.target.value);
    };

    useEffect(() => {
        setValidError(false);
    }, [control._fields]);

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
                <Tooltip title={validError && props.regExp?.message ? props.regExp.message : (fieldState.error?.message ?? (props.regExp ? props.regExp.message : ''))}
                         open={(fieldState.error !== undefined || validError) && focus}>
                    <div className={(fieldState.error !== undefined || validError) ? 'tooltip error' : ''}>
                        <Input.Search {...props}
                            readOnly={props.onlyUseButtonFlag === true}
                            enterButton={
                                props.onlyUseButtonFlag === true ?
                                    <Button type="primary" onClick={props.onClickSearchBtn} disabled={props.disabledButton}>
                                        <IconBtnSearch/>
                                    </Button>
                                    :
                                    undefined
                            }
                            id={field.name}
                            name={field.name}
                            value={field.value ?? ''}
                            onChange={(v) => {
                                handleChange(field, v);
                            }}
                            onBlur={(v) => {
                                field.onChange(v);
                                onChangeValue && onChangeValue(v.target.value);
                            }}
                            onMouseEnter={() => setFocus(true)}
                            onMouseLeave={() => {setFocus(false);setValidError(false);}}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                </Tooltip>
            )}
        />
    );
};

export default CustomValidFormSearchInput;
