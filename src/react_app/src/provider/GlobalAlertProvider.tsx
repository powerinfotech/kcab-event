import {useEffect, useRef} from 'react';
import {useRecoilValue} from 'recoil';
import {Modal} from 'antd';
import {alertAtom} from '@atom/alertAtom';

/**
 * alert는 useEffect에서 한 번만 띄움.
 * (렌더 중에 호출하면 Strict Mode 등에서 2번 실행되어 창이 두 번 뜸)
 */
const GlobalAlertProvider = () => {
    const alertState = useRecoilValue(alertAtom);
    const {info} = Modal;
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
