import {useEffect, useRef} from 'react';
import {useRecoilValue} from 'recoil';
import {confirmAtom} from '@atom/confirmAtom';
import {Modal} from 'antd';

/**
 * confirm은 useEffect에서 한 번만 띄움.
 * (렌더 중에 호출하면 Strict Mode 등에서 2번 실행되어 창이 두 번 뜸)
 */
const GlobalConfirmProvider = () => {
    const confirmState = useRecoilValue(confirmAtom);
    const {confirm} = Modal;
    const openedRef = useRef(false);

    useEffect(() => {
        if (!confirmState?.isOpen) {
            openedRef.current = false;
            return;
        }
        if (openedRef.current) return;
        openedRef.current = true;

        Modal.confirm({
            title: confirmState.message,
            okText: confirmState.okText,
            cancelText: confirmState.cancelText,
            onOk: confirmState.onClickOK,
            onCancel: confirmState.onClickCancel,
        });
    }, [confirmState]);

    return null;
};

export default GlobalConfirmProvider;
