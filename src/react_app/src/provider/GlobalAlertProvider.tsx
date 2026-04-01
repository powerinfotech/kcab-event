/**
 * GlobalAlertProvider - 전역 알림(Alert) 모달 프로바이더
 *
 * [목적]
 * alertAtom 상태를 구독하여 전역 알림 모달(Modal.info)을 띄운다.
 * useMessage 훅의 alert()를 통해 어디서든 알림 모달을 호출할 수 있다.
 *
 * [동작 방식]
 * - alertAtom.isOpen이 true가 되면 Modal.info()를 호출한다.
 * - openedRef로 React Strict Mode의 이중 실행을 방지한다.
 * - alertAtom.isOpen이 false로 돌아오면 openedRef를 초기화하여 다음 호출을 준비한다.
 * - 렌더링 결과 없음 (return null).
 *
 * [사용 방법]
 * @example
 * // 앱 루트에 한 번 배치
 * import GlobalAlertProvider from '@provider/GlobalAlertProvider';
 *
 * const App = () => (
 *   <RecoilRoot>
 *     <GlobalAlertProvider />
 *     <RouterProvider router={router} />
 *   </RecoilRoot>
 * );
 *
 * // 컴포넌트에서 알림 사용
 * import { useMessage } from '@hook/useMessage';
 *
 * const { alert } = useMessage();
 * await alert('저장이 완료되었습니다.');
 * await alert('오류가 발생했습니다.', '확인');
 */
import {useEffect, useRef} from 'react';
import { useAtomValue } from 'jotai';
import {Modal} from 'antd';
import {alertAtom} from '@atom/alertAtom';

const GlobalAlertProvider = () => {
    const alertState = useAtomValue(alertAtom);
    const openedRef = useRef(false);

    useEffect(() => {
        if (!alertState?.isOpen) {
            openedRef.current = false;
            return;
        }
        if (openedRef.current) return;
        openedRef.current = true;

        Modal.info({
            title: alertState.message,
            okText: alertState.okText,
            onOk: () => {
                alertState.onClickOK?.();
            },
        });
    }, [alertState]);

    return null;
};

export default GlobalAlertProvider;
