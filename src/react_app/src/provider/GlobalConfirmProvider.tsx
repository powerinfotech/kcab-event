/**
 * GlobalConfirmProvider - 전역 확인(Confirm) 모달 프로바이더
 *
 * [목적]
 * confirmAtom 상태를 구독하여 전역 확인 모달(Modal.confirm)을 띄운다.
 * useMessage 훅의 confirm()을 통해 어디서든 확인/취소 모달을 호출할 수 있다.
 *
 * [동작 방식]
 * - confirmAtom.isOpen이 true가 되면 Modal.confirm()을 호출한다.
 * - openedRef로 React Strict Mode의 이중 실행을 방지한다.
 * - confirmAtom.isOpen이 false로 돌아오면 openedRef를 초기화하여 다음 호출을 준비한다.
 * - 렌더링 결과 없음 (return null).
 *
 * [사용 방법]
 * @example
 * // 앱 루트에 한 번 배치
 * import GlobalConfirmProvider from '@provider/GlobalConfirmProvider';
 *
 * const App = () => (
 *   <RecoilRoot>
 *     <GlobalConfirmProvider />
 *     <RouterProvider router={router} />
 *   </RecoilRoot>
 * );
 *
 * // 컴포넌트에서 확인 모달 사용
 * import { useMessage } from '@hook/useMessage';
 *
 * const { confirm } = useMessage();
 * const ok = await confirm('삭제하시겠습니까?');
 * if (ok) { handleDelete(); }
 *
 * const ok2 = await confirm('저장하시겠습니까?', '저장', '취소');
 * if (ok2) { handleSave(); }
 */
import {useEffect, useRef} from 'react';
import { useAtomValue } from 'jotai';
import {confirmAtom} from '@atom/confirmAtom';
import {App} from 'antd';

const GlobalConfirmProvider = () => {
    const { modal } = App.useApp();
    const confirmState = useAtomValue(confirmAtom);
    const openedRef = useRef(false);

    useEffect(() => {
        if (!confirmState?.isOpen) {
            openedRef.current = false;
            return;
        }
        if (openedRef.current) return;
        openedRef.current = true;

        modal.confirm({
            title: confirmState.message,
            okText: confirmState.okText,
            cancelText: confirmState.cancelText,
            onOk: confirmState.onClickOK,
            onCancel: confirmState.onClickCancel,
        });
    }, [confirmState, modal]);

    return null;
};

export default GlobalConfirmProvider;
