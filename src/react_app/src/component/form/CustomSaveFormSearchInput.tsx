/**
 * CustomSaveFormSearchInput - react-hook-form 연동 검색 입력 폼 컴포넌트 (저장 폼용)
 *
 * [목적]
 * react-hook-form의 Controller를 내장하여 Input.Search와 제목 레이블을 함께 렌더링한다.
 * onlyUseButtonFlag를 사용하면 검색 버튼 클릭 시에만 팝업을 열어 값을 선택하는
 * "읽기 전용 + 검색 버튼" 패턴을 구현할 수 있다.
 *
 * [주요 Props]
 * @param name               - react-hook-form 필드 이름
 * @param control            - useForm()의 control 객체
 * @param onChangeValue      - 값 변경 시 string 전달 콜백
 * @param singleRow          - true이면 'full' 클래스 (전체 너비 단독 행)
 * @param isNoTitle          - true이면 제목 레이블 미표시
 * @param onlyUseButtonFlag  - true이면 텍스트 입력 불가, 버튼 클릭으로만 값 설정
 * @param onClickSearchBtn   - 검색 버튼 클릭 콜백 (onlyUseButtonFlag=true일 때 팝업 오픈)
 * @param disabledButton     - 검색 버튼 비활성화 여부
 * @param regExp             - 정규식 검증 { value, message }
 *
 * [사용 방법]
 * @example
 * // 직접 입력 + 검색 버튼
 * <CustomSaveFormSearchInput
 *   name="searchText"
 *   control={control}
 *   title="검색어"
 *   onChangeValue={(v) => setSearchText(v)}
 * />
 *
 * // 팝업으로만 선택 (읽기 전용 + 버튼)
 * <CustomSaveFormSearchInput
 *   name="userId"
 *   control={control}
 *   title="사용자"
 *   onlyUseButtonFlag
 *   onClickSearchBtn={() => setPopupOpen(true)}
 * />
 */
import React, {useEffect, useState} from 'react';
import {Button, Input, InputProps, Tooltip} from 'antd';
import {Control, Controller} from 'react-hook-form';
import {SearchOutlined} from "@ant-design/icons";
import IconBtnSearch from "@icon/IconBtnSearch";

interface CustomFormSearchInputProps extends InputProps {
    regExp?:{value:RegExp, message:string};
    name:string;
    defaultValue?:string;
    control:Control<any>;
    onChangeValue?:(v:string)=>void;
    singleRow?:boolean;
    isNoTitle?: boolean;
    onlyUseButtonFlag?: boolean;
    disabledButton?: boolean;
    onClickSearchBtn?: () => void;
    [key: string]: any;
}

const CustomSaveFormSearchInput = ({name, defaultValue, control, onChangeValue, singleRow=false, ...props}:CustomFormSearchInputProps) => {
    const [focus, setFocus] = useState<boolean>(false);
    const [validError, setValidError] = useState<boolean>(false);

    const handleChange = (field:any, v: React.ChangeEvent<HTMLInputElement>) => {
        setValidError(false);
        if(props.regExp && props.regExp.value && !props.regExp?.value.test(v.target.value)){
            setValidError(true);
            return;
        }
        if(v.target.value.length === 1) {
            field.onChange('');
        }
        field.onChange(v);
        props.onChangeValue && props.onChangeValue(v);
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
                <p className={singleRow ?'full': props.isNoTitle === true ? 'no-title' : ''}>
                    { props.isNoTitle === true ? <></> : <span className="tit mt0">{props.title}{props.required? <em>*</em> : <></>}</span>}
                    <div className="box-inp">
                        <Tooltip title={validError && props.regExp?.message ? props.regExp.message : (fieldState.error?.message ?? (props.regExp ? props.regExp.message : ''))}
                                 open={(fieldState.error !== undefined || validError) && focus}>
                            <div className={(fieldState.error !== undefined || validError)  ? 'tooltip error' : ''}>
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
                                    onChange={(v)=>{
                                        handleChange(field, v);
                                    }}
                                    onBlur={(v)=>{
                                        field.onChange(v);
                                        onChangeValue && onChangeValue(v.target.value);
                                    }}
                                    onMouseEnter={() => setFocus(true)}
                                    onMouseLeave={() => {setFocus(false);setValidError(false);}}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        </Tooltip>

                    </div>
                </p>
            )}
        />
    );
};

export default CustomSaveFormSearchInput;