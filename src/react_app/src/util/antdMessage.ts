/**
 * antdMessage - 전역 Ant Design message 싱글톤
 *
 * [목적]
 * App.useApp()의 message 인스턴스를 모듈 레벨에서 보관하여
 * React 훅을 사용할 수 없는 순수 유틸 함수나 인터셉터에서도
 * context-aware message(동적 테마 포함)를 사용할 수 있게 한다.
 *
 * [사용 방법]
 * 1. ClientProviders 내부 App 안에 AntdAppBridge를 배치 (앱 시작 시 1회)
 * 2. message를 사용할 파일에서 아래와 같이 import
 *
 * @example
 * import { message } from '@util/antdMessage';
 *
 * message.success('저장 되었습니다.');
 * message.error('오류가 발생하였습니다.');
 * message.info('선택한 내용이 없습니다.');
 */
import type { MessageInstance } from 'antd/es/message/interface';

let _instance: MessageInstance | null = null;

export const setAntdMessageInstance = (instance: MessageInstance): void => {
    _instance = instance;
};

const proxy =
    (type: keyof Pick<MessageInstance, 'success' | 'error' | 'info' | 'warning' | 'loading'>) =>
    (...args: Parameters<MessageInstance[typeof type]>) => {
        if (!_instance) {
            console.warn('[antdMessage] 인스턴스가 아직 초기화되지 않았습니다.');
            return Promise.resolve();
        }
        return (_instance[type] as Function)(...args);
    };

export const message: Pick<MessageInstance, 'success' | 'error' | 'info' | 'warning' | 'loading'> = {
    success: proxy('success') as MessageInstance['success'],
    error:   proxy('error')   as MessageInstance['error'],
    info:    proxy('info')    as MessageInstance['info'],
    warning: proxy('warning') as MessageInstance['warning'],
    loading: proxy('loading') as MessageInstance['loading'],
};
