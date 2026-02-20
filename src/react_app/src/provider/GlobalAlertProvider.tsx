import {useRecoilValue} from 'recoil';
import {Modal} from 'antd';
import {alertAtom} from '@atom/alertAtom';

const GlobalAlertProvider = () => {
    const alertState = useRecoilValue(alertAtom);
    const {info} = Modal;
    const provide = () => {
        if(!alertState?.isOpen) return null;

        info({
            title:alertState.message,
            okText:alertState.okText,
            onOk:alertState.onClickOK,
        });
    };

    return <> {provide()} </>;
};

export default GlobalAlertProvider;
