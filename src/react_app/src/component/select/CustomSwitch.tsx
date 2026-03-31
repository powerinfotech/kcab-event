/**
 * CustomSwitch - ON/OFF 레이블 기본 적용 토글 스위치 컴포넌트
 *
 * [목적]
 * Ant Design Switch를 래핑하여 checkedChildren="ON", unCheckedChildren="OFF"를 기본 적용한다.
 * 사용 여부(Y/N) 토글, 활성화 상태 전환 등에 사용한다.
 *
 * [사용 방법]
 * @example
 * import CustomSwitch from '@component/select/CustomSwitch';
 *
 * // 기본 (ON/OFF 레이블 자동)
 * <CustomSwitch checked={isActive} onChange={(checked) => setIsActive(checked)} />
 *
 * // 레이블 오버라이드
 * <CustomSwitch
 *   checked={useYn === 'Y'}
 *   onChange={(checked) => setUseYn(checked ? 'Y' : 'N')}
 *   checkedChildren="사용"
 *   unCheckedChildren="미사용"
 * />
 */
import React from 'react';
import {Switch, SwitchProps} from 'antd';

interface CustomSwitchProps extends SwitchProps {}

const CustomSwitch = (props: CustomSwitchProps) => {
    return (
        <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            {...props}
        />
    );
};

export default CustomSwitch;
