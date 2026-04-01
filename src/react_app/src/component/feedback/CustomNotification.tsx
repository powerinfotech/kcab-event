/**
 * CustomNotification - Ant Design Notification 유틸리티
 *
 * [목적]
 * 화면 우측 상단에 상세 알림(제목 + 설명)을 표시할 때 사용한다.
 * message API보다 긴 내용(에러 상세, 작업 완료 안내 등)에 적합하다.
 *
 * [message API와의 차이]
 * - message: 화면 상단 중앙, 짧은 한 줄 알림 (예: "저장되었습니다.")
 * - notification: 화면 우측 상단, 제목 + 설명 형태 (예: 제목 "처리 완료" + 설명 "요청하신 작업이...")
 *
 * [사용 방법]
 * @example
 * import CustomNotification from '@component/feedback/CustomNotification';
 *
 * // 성공 알림
 * CustomNotification.success('처리 완료', '요청하신 작업이 성공적으로 완료되었습니다.');
 *
 * // 오류 알림
 * CustomNotification.error('오류 발생', '서버와의 통신 중 오류가 발생하였습니다.');
 *
 * // 경고 알림
 * CustomNotification.warning('주의', '저장하지 않은 변경사항이 있습니다.');
 *
 * // 정보 알림
 * CustomNotification.info('안내', '시스템 점검이 예정되어 있습니다.');
 *
 * // 표시 시간 커스텀 (초 단위, 기본 4.5초)
 * CustomNotification.success('완료', '작업이 완료되었습니다.', 3);
 *
 * // 전체 옵션 지정
 * CustomNotification.open({
 *   message: '알림 제목',
 *   description: '상세 내용',
 *   type: 'info',
 *   duration: 5,
 *   placement: 'topRight',
 * });
 */
import {notification} from 'antd';
import type {ArgsProps} from 'antd/es/notification/interface';

const CustomNotification = {
    success: (message: string, description?: string, duration?: number) => {
        notification.success({message, description, duration});
    },
    error: (message: string, description?: string, duration?: number) => {
        notification.error({message, description, duration});
    },
    warning: (message: string, description?: string, duration?: number) => {
        notification.warning({message, description, duration});
    },
    info: (message: string, description?: string, duration?: number) => {
        notification.info({message, description, duration});
    },
    open: (config: ArgsProps) => {
        notification.open(config);
    },
};

export default CustomNotification;
