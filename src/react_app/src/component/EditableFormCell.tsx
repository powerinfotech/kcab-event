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
