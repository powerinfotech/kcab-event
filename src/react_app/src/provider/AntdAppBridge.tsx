/**
 * AntdAppBridge - App.useApp() 인스턴스를 전역 싱글톤에 주입하는 브릿지 컴포넌트
 *
 * [목적]
 * Ant Design App 컴포넌트 내부에서 App.useApp()의 message 인스턴스를 가져와
 * antdMessage 싱글톤에 저장한다.
 * 이를 통해 React 훅을 쓸 수 없는 순수 유틸 함수에서도
 * context-aware message를 사용할 수 있다.
 *
 * [사용 방법]
 * ClientProviders의 <App> 내부에 한 번만 배치한다.
 *
 * @example
 * <ConfigProvider ...>
 *   <App>
 *     <AntdAppBridge />
 *     {children}
 *   </App>
 * </ConfigProvider>
 */
import { useEffect } from 'react';
import { App } from 'antd';
import { setAntdMessageInstance } from '@util/antdMessage';

const AntdAppBridge = () => {
    const { message } = App.useApp();

    useEffect(() => {
        setAntdMessageInstance(message);
    }, [message]);

    return null;
};

export default AntdAppBridge;
