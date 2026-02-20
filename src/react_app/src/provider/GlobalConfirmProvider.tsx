import {useRecoilValue} from 'recoil';
import {confirmAtom} from '@atom/confirmAtom';
import {Modal} from 'antd';

const GlobalConfirmProvider = () => {
    const confirmState = useRecoilValue(confirmAtom);
    const {confirm} = Modal;
    const provide = () => {
        if(!confirmState?.isOpen) return null;

        confirm({
            title:confirmState.message,
            okText:confirmState.okText,
            cancelText:confirmState.cancelText,
            onOk:confirmState.onClickOK,
            onCancel:confirmState.onClickCancel
        });
    };

    return <> {provide()} </>;
};

export default GlobalConfirmProvider;
