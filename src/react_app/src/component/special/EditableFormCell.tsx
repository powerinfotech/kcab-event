/**
 * EditableFormCell - react-hook-form 기반 테이블 인라인 편집 셀 컴포넌트
 *
 * [목적]
 * CustomTable의 특정 컬럼 셀을 편집 가능한 입력 필드로 렌더링한다.
 * react-hook-form과 연동하여 유효성 검사와 변경 감지를 처리한다.
 *
 * [동작 방식]
 * 1. fieldName = `${record[seqField]}_${fieldSuffix}` 형식으로 고유 필드명 생성
 * 2. record의 값이 바뀌면 setValue로 폼 필드 동기화
 * 3. 입력 변경 시 transformValue 적용 후 onDataChange로 부모에 전달
 *
 * @param record          - 테이블 행 데이터 객체
 * @param seqField        - 행 고유 키 필드명 (예: 'userSeq')
 * @param fieldSuffix     - 편집 컬럼명 (예: 'userName')
 * @param value           - 현재 셀 값
 * @param setValue        - react-hook-form의 setValue 함수
 * @param control         - react-hook-form의 control 객체
 * @param register        - react-hook-form의 register 함수
 * @param onDataChange    - 셀 값 변경 시 (record, 컬럼명, 새값) 전달 콜백
 * @param requiredMessage - 필수 입력 오류 메시지
 * @param maxLength       - 최대 입력 길이
 * @param regExp          - 정규식 검증
 * @param transformValue  - 입력값 변환 함수 (예: 대문자 변환)
 *
 * [사용 방법]
 * @example
 * import EditableFormCell from '@component/special/EditableFormCell';
 *
 * const { control, register, setValue } = useForm();
 *
 * const columns = [
 *   {
 *     title: '이름',
 *     dataIndex: 'userName',
 *     render: (value, record) => (
 *       <EditableFormCell
 *         record={record}
 *         seqField="userSeq"
 *         fieldSuffix="userName"
 *         value={value}
 *         setValue={setValue}
 *         control={control}
 *         register={register}
 *         onDataChange={(rec, key, val) => updateRow(rec.userSeq, key, val)}
 *         requiredMessage="이름을 입력해주세요."
 *         maxLength={50}
 *       />
 *     ),
 *   },
 * ];
 */
import React, {useEffect} from 'react';
import CustomValidFormInput from '@component/form/CustomValidFormInput';

interface EditableCellProps<T extends Record<string, any>> {
    record: T;
    seqField: keyof T;
    fieldSuffix: string;
    value: string;
    setValue: (name: string, v: string) => void;
    control: any;
    register: any;
    onDataChange: (record: T, key: string, value: any) => void;
    requiredMessage: string;
    maxLength?: number;
    regExp?: { value: RegExp; message: string };
    transformValue?: (v: string) => string;
}

function EditableFormCell<T extends Record<string, any>>({
    record,
    seqField,
    fieldSuffix,
    value,
    setValue,
    control,
    register,
    onDataChange,
    requiredMessage,
    maxLength,
    regExp,
    transformValue,
}: EditableCellProps<T>) {
    const fieldName = `${record[seqField]}_${fieldSuffix}`;

    useEffect(() => {
        setValue(fieldName, value);
    }, [fieldName, value, setValue]);

    return (
        <CustomValidFormInput
            control={control}
            required={true}
            maxLength={maxLength}
            regExp={regExp}
            onChangeValue={(v) => {
                const finalValue = transformValue ? transformValue(v) : v;
                onDataChange(record, fieldSuffix, finalValue);
            }}
            {...register(fieldName, {required: requiredMessage})}
        />
    );
}

export default EditableFormCell;
