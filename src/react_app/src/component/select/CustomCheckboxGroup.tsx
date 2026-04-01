/**
 * CustomCheckboxGroup - options 배열 지원 체크박스 그룹 컴포넌트
 *
 * [목적]
 * Ant Design Checkbox.Group을 래핑하여 options 배열로 체크박스를 간편하게 생성한다.
 * 복수 값을 선택해야 하는 경우에 사용한다.
 * 단일 체크박스는 CustomCheckbox, 단일 선택(라디오)은 CustomRadioGroup을 사용한다.
 *
 * @param options - { value, label, disabled? }[] 배열 (선택 시 Checkbox 자동 생성)
 *
 * [사용 방법]
 * @example
 * import CustomCheckboxGroup from '@component/select/CustomCheckboxGroup';
 *
 * // options 배열 사용 (권장)
 * <CustomCheckboxGroup
 *   options={[
 *     { value: 'READ',   label: '조회' },
 *     { value: 'WRITE',  label: '등록/수정' },
 *     { value: 'DELETE', label: '삭제' },
 *   ]}
 *   value={selectedPerms}
 *   onChange={(checkedValues) => setSelectedPerms(checkedValues as string[])}
 * />
 *
 * // 일부 항목 비활성화
 * <CustomCheckboxGroup
 *   options={[
 *     { value: 'READ',   label: '조회' },
 *     { value: 'WRITE',  label: '등록/수정', disabled: true },
 *     { value: 'DELETE', label: '삭제',      disabled: true },
 *   ]}
 *   value={selectedPerms}
 *   onChange={(checkedValues) => setSelectedPerms(checkedValues as string[])}
 * />
 *
 * // 세로 방향 배치
 * <CustomCheckboxGroup
 *   options={menuList.map((m) => ({ value: m.menuSeq, label: m.menuNm }))}
 *   value={selectedMenus}
 *   onChange={(vals) => setSelectedMenus(vals as number[])}
 *   style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
 * />
 *
 * // children 직접 배치
 * <CustomCheckboxGroup value={checked} onChange={setChecked}>
 *   <Checkbox value="A">항목 A</Checkbox>
 *   <Checkbox value="B">항목 B</Checkbox>
 * </CustomCheckboxGroup>
 */
import React from 'react';
import {Checkbox, CheckboxGroupProps} from 'antd';

interface CustomCheckboxGroupOption {
    value: any;
    label: string;
    disabled?: boolean;
}

interface CustomCheckboxGroupProps extends Omit<CheckboxGroupProps, 'options'> {
    options?: CustomCheckboxGroupOption[];
}

const CustomCheckboxGroup = ({options, children, ...restProps}: CustomCheckboxGroupProps) => {
    return (
        <Checkbox.Group {...restProps}>
            {options
                ? options.map((item) => (
                    <Checkbox key={item.value} value={item.value} disabled={item.disabled}>
                        {item.label}
                    </Checkbox>
                ))
                : children
            }
        </Checkbox.Group>
    );
};

export default CustomCheckboxGroup;
