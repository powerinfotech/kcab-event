/**
 * CustomAlert - Ant Design Alert 래퍼 컴포넌트
 *
 * [목적]
 * 안내 메시지, 경고, 오류 등을 인라인 알림 박스로 표시할 때 사용한다.
 * 팝업이 아닌 화면 내 고정 알림에 적합하다.
 *
 * [사용 방법]
 * @example
 * // 정보
 * <CustomAlert type="info" title="데이터를 불러오는 중입니다." />
 *
 * // 경고
 * <CustomAlert type="warning" title="저장하지 않은 변경사항이 있습니다." showIcon />
 *
 * // 오류 (닫기 가능)
 * <CustomAlert type="error" title="저장에 실패했습니다." closable />
 *
 * // 설명 포함
 * <CustomAlert
 *   type="success"
 *   title="저장 완료"
 *   content="변경사항이 성공적으로 저장되었습니다."
 *   showIcon
 * />
 */
import React from 'react';
import {Alert, AlertProps} from 'antd';

interface CustomAlertProps extends AlertProps {
    content?: React.ReactNode;
}

const CustomAlert = ({content, description, ...props}: CustomAlertProps) => {
    return (
        <Alert {...props} description={description ?? content} />
    );
};

export default CustomAlert;
